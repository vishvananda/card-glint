import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { atomicWrite } from './common.mjs';

export { WIDTH, HEIGHT, normalize, luminance, cropGray } from './pixels-pure.mjs';

export async function readPng(file) {
  return PNG.sync.read(await readFile(file), { checkCRC: true });
}

export async function savePng(file, image) {
  // Lossless previews do not need the expensive maximum-compression/filter search.
  await atomicWrite(file, PNG.sync.write(image, { deflateLevel: 3, filterType: 4 }));
}
