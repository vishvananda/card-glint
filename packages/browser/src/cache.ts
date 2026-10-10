import { ResourceCache } from '../generated/renderer.js';
import type { CacheStats, Lease } from './types.js';

/** Owns handles; Rust owns byte admission, recency and pin accounting. */
export class ResourceStore<T> {
  private policy: ResourceCache;
  private resources = new Map<number, T>();
  private generation = 0;
  constructor(
    bytes: number,
    private destroy: (value: T) => void,
  ) {
    if (!Number.isSafeInteger(bytes) || bytes < 1 || bytes > 0xffffffff)
      throw RangeError('Invalid cache budget');
    this.policy = new ResourceCache(bytes);
  }
  acquire(key: string): Lease<T> | null {
    const id = this.policy.lookup(key);
    return id === undefined ? null : this.lease(id);
  }
  insert(key: string, value: T, bytes: number): Lease<T> {
    if (!Number.isSafeInteger(bytes) || bytes < 1 || bytes > 0xffffffff) {
      this.destroy(value);
      throw RangeError('Invalid resource size');
    }
    let result: { handle: number; evicted: number[] };
    try {
      result = JSON.parse(this.policy.admit(key, bytes, 1));
    } catch (error) {
      this.destroy(value);
      throw error;
    }
    for (const id of result.evicted) {
      const old = this.resources.get(id);
      if (old !== undefined) this.destroy(old);
      this.resources.delete(id);
    }
    if (this.resources.has(result.handle)) this.destroy(value);
    else this.resources.set(result.handle, value);
    return this.lease(result.handle);
  }
  /** Admit and evict before allocating a GPU object, so a miss does not
   * temporarily duplicate the resident cache's entire working set. */
  create(key: string, bytes: number, build: () => T, priority = 1): Lease<T> {
    if (!Number.isSafeInteger(bytes) || bytes < 1 || bytes > 0xffffffff)
      throw RangeError('Invalid resource size');
    const admission: { handle: number; evicted: number[] } = JSON.parse(
      this.policy.admit(key, bytes, priority),
    );
    for (const id of admission.evicted) {
      const old = this.resources.get(id);
      if (old !== undefined) this.destroy(old);
      this.resources.delete(id);
    }
    if (this.resources.has(admission.handle)) return this.lease(admission.handle);
    try {
      this.resources.set(admission.handle, build());
      return this.lease(admission.handle);
    } catch (error) {
      this.policy.remove(admission.handle);
      throw error;
    }
  }
  private lease(id: number): Lease<T> {
    const value = this.resources.get(id);
    if (value === undefined) throw Error('Resource ownership mismatch');
    this.policy.pin(id, true);
    const generation = this.generation;
    let released = false;
    return {
      value,
      release: () => {
        if (released) return;
        released = true;
        if (generation === this.generation) this.policy.pin(id, false);
      },
    };
  }
  get stats(): CacheStats {
    return JSON.parse(this.policy.stats());
  }
  clear() {
    this.generation++;
    for (const value of this.resources.values()) this.destroy(value);
    this.resources.clear();
    this.policy.clear();
  }
  dispose() {
    this.clear();
    this.policy.free();
  }
}
