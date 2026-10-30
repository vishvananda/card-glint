// Only tests of pre-0.7.10 evidence import this view. It is never used by a live renderer.
import fs from 'node:fs/promises';
import path from 'node:path';
import { root } from '../games/magic/tools/accuracy/common.mjs';
import { preFontGeometrySource } from '../games/magic/tools/accuracy/font-geometry-ancestry.mjs';
export { fontGeometryHistoricalHash as sourceHash } from '../games/magic/tools/accuracy/font-geometry-ancestry.mjs';
export async function readFile(file, options) {
  const value = await fs.readFile(file);
  const key = path.relative(root, path.resolve(String(file)));
  const bytes = await preFontGeometrySource(key, value);
  const encoding = typeof options === 'string' ? options : options?.encoding;
  return encoding ? bytes.toString(encoding) : bytes;
}
export default { ...fs, readFile };
