// Independent adoption proposal on immutable pre-default source, never production.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
export async function modernDefaultProposalStudy(referenceRoot) {
  const names = [
    'modern-printing-profile.ts',
    'modern-footer.ts',
    'calibration-profiles.ts',
    'frame-plates.ts',
  ];
  const originals = new Map(
    await Promise.all(
      names.map(async (n) => [
        path.join(referenceRoot, 'games/magic/src/presentation', n),
        await readFile(path.join(referenceRoot, 'games/magic/src/presentation', n), 'utf8'),
      ]),
    ),
  );
  return {
    name: 'independent-modern-default-adoption',
    enforce: 'pre',
    transform(source, id) {
      const codeKey = id.split('?')[0];
      if (!originals.has(codeKey)) return;
      assert.equal(source, originals.get(codeKey));
      let code = source;
      const replace = (needle, text) => {
        assert.equal(code.split(needle).length, 2, needle);
        code = code.replace(needle, text);
      };
      if (codeKey.endsWith('/modern-printing-profile.ts')) {
        replace(
          'export function modernPrintingProfile(',
          'function referenceModernPrintingProfile(',
        );
        code += String.raw`
export function modernPrintingProfile(face: RenderedCardInput){
 if(!(globalThis as any).__modernDefaultsProposal)return referenceModernPrintingProfile(face);
 const donor=referenceModernPrintingProfile({...face,setCode:'m21',frameStyle:'modern',
  frameAssetFamily:undefined,frameTemplate:undefined,faces:undefined,layout:'normal',
  typeLine:'Creature',canonicalTypeLine:'Creature'});
 if(!donor)throw Error('Missing immutable M21 style donor');
 if(face.setCode?.toLowerCase()==='m21' && referenceModernPrintingProfile(face))return donor;
 return {...donor,inheritedFrom:'m21',printedLandRarities:[],foilStarNumbers:[],
  planeswalkers:{...donor.planeswalkers,deckCollectorNumbers:[]}};
}
`;
      } else if (codeKey.endsWith('/modern-footer.ts')) {
        replace('/^(\\d{3}(?:\\/274)?) ([CMRUL])$/', '/^(\\d{3}(?:\\/\\d+)?) ([CMRUL])$/');
      } else if (codeKey.endsWith('/frame-plates.ts')) {
        replace(
          '    planarCalibratedStock(face, plate.frame) ||',
          "    ((globalThis as any).__modernDefaultsProposal && face.colorCalibration === 'set-hsb-v1' && modernOrdinaryPlates(face)) ||\n    planarCalibratedStock(face, plate.frame) ||",
        );
      } else {
        replace('export function calibratedManaTarget(', 'function referenceCalibratedManaTarget(');
        code += String.raw`
export function calibratedManaTarget(face:RenderedCardInput,symbol:string):Rgb|undefined{
 const prior=referenceCalibratedManaTarget(face,symbol);
 if(prior)return prior;
 if(!(globalThis as any).__modernDefaultsProposal||face.colorCalibration!=='set-hsb-v1'||face.calibration==='source')return undefined;
 const style=modernPrintingProfile(face);
 if(face.setCode?.toLowerCase()==='m21'&&!style?.inheritedFrom)return prior;
 const target=style?.mana?.paperTargets[symbol];
 return target?[target[0]/255,target[1]/255,target[2]/255]:undefined;
}
`;
      }
      return { code, map: null };
    },
  };
}
