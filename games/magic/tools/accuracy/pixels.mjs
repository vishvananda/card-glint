import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { atomicWrite } from './common.mjs';

export const WIDTH = 488;
export const HEIGHT = 680;

export async function readPng(file) {
  return PNG.sync.read(await readFile(file), { checkCRC: true });
}

export async function savePng(file, image) {
  // Lossless previews do not need the expensive maximum-compression/filter search.
  await atomicWrite(file, PNG.sync.write(image, { deflateLevel: 3, filterType: 4 }));
}

/** Uniform image-to-card normalization. The global profile is applied to references only. */
export function normalize(image, transform = {}) {
  const width = WIDTH,
    height = HEIGHT;
  const { tx = 0, ty = 0, scale = 1, rotation = 0 } = transform;
  const factor = Math.min(width / image.width, height / image.height);
  const padX = (width - image.width * factor) / 2,
    padY = (height - image.height * factor) / 2;
  const data = new Uint8Array(width * height * 4);
  const cosine = Math.cos(rotation) / scale,
    sine = Math.sin(rotation) / scale;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const dx = x - width / 2 - tx,
        dy = y - height / 2 - ty;
      const sx = (cosine * dx + sine * dy + width / 2 - padX + 0.5) / factor - 0.5;
      const sy = (-sine * dx + cosine * dy + height / 2 - padY + 0.5) / factor - 0.5;
      const i = (y * width + x) * 4;
      if (sx < 0 || sy < 0 || sx > image.width - 1 || sy > image.height - 1) continue;
      const left = Math.floor(sx),
        top = Math.floor(sy),
        right = Math.min(left + 1, image.width - 1),
        bottom = Math.min(top + 1, image.height - 1);
      const fx = sx - left,
        fy = sy - top;
      for (let channel = 0; channel < 4; channel++) {
        const a = image.data[(top * image.width + left) * 4 + channel];
        const b = image.data[(top * image.width + right) * 4 + channel];
        const c = image.data[(bottom * image.width + left) * 4 + channel];
        const d = image.data[(bottom * image.width + right) * 4 + channel];
        data[i + channel] = Math.round(
          (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy,
        );
      }
    }
  return {
    width,
    height,
    data,
    normalization: {
      sourceWidth: image.width,
      sourceHeight: image.height,
      factor,
      padX,
      padY,
      aspectErrorPercent: 100 * (image.width / image.height / (width / height) - 1),
    },
  };
}

export function luminance(image) {
  const result = new Float32Array(image.width * image.height);
  for (let i = 0; i < result.length; i++) {
    const p = i * 4,
      alpha = image.data[p + 3] / 255;
    result[i] =
      alpha * (0.2126 * image.data[p] + 0.7152 * image.data[p + 1] + 0.0722 * image.data[p + 2]) +
      (1 - alpha) * 128;
  }
  return result;
}

export function cropGray(image, rect) {
  const [x, y, width, height] = rect.map(Math.round);
  if (x < 0 || y < 0 || x + width > image.width || y + height > image.height)
    throw Error('Region outside image');
  const gray = new Float32Array(width * height);
  for (let row = 0; row < height; row++)
    for (let col = 0; col < width; col++) {
      const p = ((row + y) * image.width + col + x) * 4;
      gray[row * width + col] =
        0.2126 * image.data[p] + 0.7152 * image.data[p + 1] + 0.0722 * image.data[p + 2];
    }
  return { gray, width, height };
}
