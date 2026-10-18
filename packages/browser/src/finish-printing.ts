import { Cardstock } from './gpu/cardstock.js';
import { texture } from './gpu/etcher.js';
import { PrintedInk } from './gpu/printed-ink.js';
import type { Texture } from './gpu/textures.js';
import type { Instance } from './types.js';
import { validatePrintDots } from './validation.js';

/** Tightly packed, bottom-row-first RGBA bytes. Printing is straight-alpha sRGB;
 * cardstock is linear packed slope data, including its alpha byte. */
export interface FinishMap {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array;
}

export class FinishPrinting {
  private ink?: PrintedInk;
  private stock?: Cardstock;
  private stockMap?: FinishMap;
  private disposed = false;
  constructor(private gl: WebGL2RenderingContext) {}

  private available() {
    if (this.disposed || this.gl.isContextLost()) throw Error('Finish resources unavailable');
  }

  private snapshot(map: Texture): FinishMap {
    const gl = this.gl;
    const framebuffer = gl.createFramebuffer();
    if (!framebuffer) throw Error('Finish resource framebuffer unavailable');
    try {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, map.texture, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
        throw Error('Finish resource framebuffer is incomplete');
      const data = new Uint8Array(map.width * map.height * 4);
      gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
      gl.readPixels(0, 0, map.width, map.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      this.available();
      return { width: map.width, height: map.height, data };
    } finally {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(framebuffer);
    }
  }

  printDots(
    source: TexImageSource,
    width: number,
    height: number,
    settings: NonNullable<Instance['printDots']>,
  ): FinishMap {
    this.available();
    if (!settings || typeof settings !== 'object') throw Error('Invalid print dots');
    validatePrintDots(settings);
    const gl = this.gl;
    const limit = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 1 ||
      height < 1 ||
      width > limit ||
      height > limit ||
      width * height > 4194304
    )
      throw Error('Invalid printing size');
    let sourceWidth: number, sourceHeight: number;
    if (source instanceof HTMLImageElement) {
      sourceWidth = source.naturalWidth;
      sourceHeight = source.naturalHeight;
    } else if (source instanceof HTMLVideoElement) {
      sourceWidth = source.videoWidth;
      sourceHeight = source.videoHeight;
    } else if (typeof VideoFrame !== 'undefined' && source instanceof VideoFrame) {
      sourceWidth = source.displayWidth;
      sourceHeight = source.displayHeight;
    } else {
      sourceWidth = (source as ImageData).width;
      sourceHeight = (source as ImageData).height;
    }
    if (sourceWidth !== width || sourceHeight !== height)
      throw Error('Printing size must match the source');

    let input: WebGLTexture | undefined;
    let output: Texture | undefined;
    let canvas: HTMLCanvasElement | undefined;
    try {
      // WebGL ignores UNPACK_FLIP_Y_WEBGL for ImageBitmap. Match native uploads.
      if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
        canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) throw Error('Printing source canvas unavailable');
        context.drawImage(source, 0, 0);
        source = canvas;
      }
      const allocated: WebGLTexture = texture(gl, width, height, gl.SRGB8_ALPHA8, gl.RGBA)!;
      input = allocated;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, allocated);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.BROWSER_DEFAULT_WEBGL);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
      this.ink ??= new PrintedInk(gl);
      output = this.ink.paint({ texture: allocated, width, height }, [
        settings.amount,
        settings.period ?? 5,
        settings.variation ?? 0.5,
        settings.inset ?? 0,
      ]);
      return this.snapshot(output);
    } finally {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.deleteTexture(input ?? null);
      gl.deleteTexture(output?.texture ?? null);
      if (canvas) canvas.width = canvas.height = 0;
    }
  }

  cardstock(): FinishMap {
    this.available();
    if (this.stockMap) return this.stockMap;
    this.stock ??= new Cardstock(this.gl);
    this.stock.prepare();
    this.stockMap = this.snapshot({
      texture: this.stock.map!,
      width: this.stock.width,
      height: this.stock.height,
    });
    return this.stockMap;
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.ink?.dispose();
    this.stock?.dispose();
    this.stockMap = undefined;
  }
}
