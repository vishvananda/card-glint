type Hit = { instance: number; uv: readonly [number, number]; part?: string | null };

/** Host input policy: drag a card to tilt; swipe empty canvas to scroll the page. */
export class ShowcaseInput {
  pointer: [number, number] = [0.5, 0.5];
  hover: Hit | undefined;
  private cursor: [number, number] | undefined;
  private touch: { id: number; instance: number } | undefined;
  private readonly events = new AbortController();

  constructor(
    private readonly surface: HTMLCanvasElement,
    private readonly hitTest: (x: number, y: number) => Hit | null | undefined,
    private readonly changed: () => void,
  ) {
    const options = { signal: this.events.signal };
    surface.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'touch' && !this.touch) this.move(e.clientX, e.clientY);
      },
      options,
    );
    const leave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch' && !this.touch) this.clear();
    };
    surface.addEventListener('pointerleave', leave, options);
    surface.addEventListener('pointercancel', leave, options);

    // Pointer Events surrender vertical drags to pan-y. A non-passive touch
    // listener lets us claim only gestures that START on a hit-tested card.
    // Disabling touch-action on the tall canvas would also trap gap scrolling.
    const touchOptions = { ...options, passive: false };
    surface.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length !== 1) return this.clear();
        const point = e.changedTouches[0];
        if (!point) return;
        const hit = this.hit(point.clientX, point.clientY);
        if (!hit || !e.cancelable) return;
        e.preventDefault();
        this.touch = { id: point.identifier, instance: hit.instance };
        this.move(point.clientX, point.clientY);
      },
      touchOptions,
    );
    surface.addEventListener(
      'touchmove',
      (e) => {
        if (!this.touch) return;
        if (e.touches.length !== 1) return this.clear();
        const point = [...e.changedTouches].find((p) => p.identifier === this.touch!.id);
        if (!point) return;
        if (e.cancelable) e.preventDefault();
        this.move(point.clientX, point.clientY);
      },
      touchOptions,
    );
    const end = (e: TouchEvent) => {
      if (this.touch && [...e.changedTouches].some((p) => p.identifier === this.touch!.id)) {
        this.clear();
      }
    };
    surface.addEventListener('touchend', end, options);
    surface.addEventListener('touchcancel', end, options);
    window.addEventListener('blur', () => this.clear(), options);
  }

  private hit(x: number, y: number) {
    const rect = this.surface.getBoundingClientRect();
    return this.hitTest(x - rect.left, y - rect.top);
  }

  private move(x: number, y: number) {
    const rect = this.surface.getBoundingClientRect();
    this.cursor = [x, y];
    this.pointer = [
      Math.max(0, Math.min(1, (x - rect.left) / rect.width)),
      Math.max(0, Math.min(1, (y - rect.top) / rect.height)),
    ];
    this.sample();
    this.changed();
  }

  /** Refresh picking as the card tilts; keep a touch attached to its starting card. */
  sample() {
    if (this.cursor) {
      const hit = this.hit(...this.cursor);
      if (!this.touch || hit?.instance === this.touch.instance) this.hover = hit ?? undefined;
    }
    return this.hover;
  }

  private clear() {
    this.cursor = undefined;
    this.touch = undefined;
    this.hover = undefined;
    this.pointer = [0.5, 0.5];
    this.changed();
  }

  dispose() {
    this.events.abort();
  }
}
