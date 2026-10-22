import { ResourceStore } from '../cache.js';
import { GpuEtcher, texture } from './etcher.js';
import { PixelKernels } from '../../generated/renderer.js';
import type { Lease, Size } from '../types.js';
export interface Texture {
  texture: WebGLTexture;
  width: number;
  height: number;
  /** Color mip levels are owned and accounted by this texture store. */
  mipmapped?: boolean;
}
/** Exact payload of the full 2D mip chain, including odd-sized rasters. */
export function textureMipBytes(width: number, height: number): number {
  let bytes = 0,
    w = width,
    h = height;
  while (true) {
    bytes += w * h * 4;
    if (w === 1 && h === 1) return bytes;
    w = Math.max(1, Math.floor(w / 2));
    h = Math.max(1, Math.floor(h / 2));
  }
}
export class TextureStore {
  readonly store: ResourceStore<Texture>;
  readonly etcher: GpuEtcher;
  readonly kernels = new PixelKernels();
  uploads = 0;
  edgeBuilds = 0;
  readbacks = 0;
  constructor(
    readonly gl: WebGL2RenderingContext,
    bytes: number,
    readonly scratchLimit: number,
    readonly mode: 'gpu' | 'rust' = 'gpu',
  ) {
    this.store = new ResourceStore(bytes, (value) => gl.deleteTexture(value.texture));
    this.etcher = new GpuEtcher(gl);
  }
  upload(
    key: string,
    source: HTMLCanvasElement | ImageBitmap,
    srgb = true,
    priority = 1,
  ): Lease<Texture> {
    const hit = this.store.acquire(key);
    if (hit) return hit;
    const gl = this.gl,
      w = source.width,
      h = source.height;
    return this.store.create(
      key,
      srgb ? textureMipBytes(w, h) : w * h * 4,
      () => {
        const handle = texture(gl, w, h, srgb ? gl.SRGB8_ALPHA8 : gl.RGBA8, gl.RGBA)!;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, handle);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          try {
            canvas.getContext('2d')!.drawImage(source, 0, 0);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
          } finally {
            canvas.width = canvas.height = 0;
          }
        } else {
          gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        if (srgb) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
        }
        this.uploads++;
        return { texture: handle, width: w, height: h, mipmapped: srgb };
      },
      priority,
    );
  }
  edge(key: string, source: HTMLCanvasElement | ImageBitmap, threshold: number): Lease<Texture> {
    const hit = this.store.acquire(key);
    if (hit) return hit;
    const gl = this.gl,
      w = source.width,
      h = source.height;
    if (w * h * 7 > this.scratchLimit) throw Error('Etching exceeds scratch budget');
    return this.store.create(
      key,
      w * h,
      () => {
        let result: WebGLTexture;
        if (this.mode === 'gpu') result = this.etcher.run(source, w, h, threshold)!;
        else {
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          try {
            const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
            ctx.drawImage(source, 0, 0);
            const rgba = ctx.getImageData(0, 0, w, h).data;
            const topDown = this.kernels.etch(
                w,
                h,
                new Uint8Array(rgba.buffer, rgba.byteOffset, rgba.byteLength),
                threshold,
              ),
              bottomUp = new Uint8Array(topDown.length);
            for (let y = 0; y < h; y++)
              bottomUp.set(topDown.subarray(y * w, (y + 1) * w), (h - 1 - y) * w);
            result = texture(gl, w, h)!;
            gl.bindTexture(gl.TEXTURE_2D, result);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RED, gl.UNSIGNED_BYTE, bottomUp);
          } finally {
            canvas.width = canvas.height = 0;
          }
        }
        this.uploads++;
        this.edgeBuilds++;
        return { texture: result, width: w, height: h };
      },
      0,
    );
  }
  uploadBytes(key: string, bytes: Uint8Array, size: Size): Lease<Texture> {
    const old = this.store.acquire(key);
    if (old) return old;
    const gl = this.gl,
      [w, h] = size,
      bottomUp = new Uint8Array(bytes.length);
    for (let y = 0; y < h; y++)
      bottomUp.set(bytes.subarray(y * w * 4, (y + 1) * w * 4), (h - 1 - y) * w * 4);
    return this.store.create(key, w * h * 4, () => {
      const result = texture(gl, w, h, gl.RGBA8, gl.RGBA)!;
      gl.bindTexture(gl.TEXTURE_2D, result);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, bottomUp);
      this.uploads++;
      return { texture: result, width: w, height: h };
    });
  }
  read(value: Texture) {
    this.readbacks++;
    return this.etcher.read(value.texture, value.width, value.height);
  }
  get scratchBytes() {
    return this.etcher.width * this.etcher.height * 7;
  }
  dispose() {
    this.store.dispose();
    this.etcher.dispose();
    this.kernels.free();
  }
}
