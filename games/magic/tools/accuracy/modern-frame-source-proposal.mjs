// Independent proposal on immutable pre-adoption source; never installed at runtime.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
export async function modernFrameSourceProposal(referenceRoot) {
  const files = ['profile.ts', 'modern-printing-profile.ts'];
  const expected = new Map(
    await Promise.all(
      files.map(async (file) => [
        path.join(referenceRoot, 'games/magic/src/presentation', file),
        await readFile(path.join(referenceRoot, 'games/magic/src/presentation', file), 'utf8'),
      ]),
    ),
  );
  return {
    name: 'independent-modern-frame-source-proposal',
    enforce: 'pre',
    transform(source, id) {
      if (!expected.has(id)) return;
      assert.equal(source, expected.get(id));
      let code = source;
      const once = (needle, replacement) => {
        assert.equal(code.split(needle).length, 2, needle);
        code = code.replace(needle, replacement);
      };
      if (id.endsWith('/profile.ts')) {
        code = "import {modernPrintingProfile} from './modern-printing-profile.js';\n" + code;
        once(
          '          : boxes,',
          `          : legendary && colors.length === 2 &&
          (input as any).setCode && modernPrintingProfile(input as any)
            ? colorKey : boxes,`,
        );
        once(
          '  const colors = normalizeColors(input.colors ?? []);',
          `
  if ((input as any).setCode?.toLowerCase() === 'm21' &&
      (input as any).collectorNumber === '246' && (input as any).name === 'Fabled Passage') {
    const printing = modernPrintingProfile(input as any);
    if (printing && !printing.inheritedFrom) return ['W','U','B','R','G'];
  }
  const colors = normalizeColors(input.colors ?? []);`,
        );
      } else {
        once(
          '  if (colors.length > 2) return undefined;',
          `
  if (colors.length > 2) {
    const source = profile.root + '/lm.png';
    const neutral = profile.materials[profile.root + '/l.png'];
    if (!neutral) throw Error('Independent land proposal lacks source-local masks');
    const identity = {hueDegrees:0,saturationScale:1,brightnessScale:1};
    const material = {...neutral,frame:identity,paper:identity,
      regions:neutral.regions?.map(r=>({...r,adjustment:identity}))};
    return {profile:{...profile,materials:{...profile.materials,[source]:material}},
      sources:[source],dual:false};
  }`,
        );
      }
      return { code, map: null };
    },
  };
}
