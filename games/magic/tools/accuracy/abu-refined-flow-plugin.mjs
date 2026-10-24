// Study-only refined flow: preserve the pre-change budget and isolate reviewed exceptions.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
const WORD =
  "You may look at opponent's hand and choose any card opponent can legally play using mana from his or her mana pool or lands. Opponent must play this card immediately; you make all the decisions it calls for. This spell may not be countered after you have looked at opponent's hand.";
export function abuRefinedFlowPlugin(proof) {
  const once = (s, a, b) => {
    assert.equal(s.split(a).length, 2, 'Refined flow hook changed: ' + a);
    return s.replace(a, b);
  };
  return {
    name: 'abu-refined-flow',
    enforce: 'pre',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code;
      if (file === 'retro-rules.ts') {
        code = once(
          source,
          '  const run = () => {',
          "  const reviewedWordRows=(globalThis as any).__abuFlow?.wordSeven && face.name==='Word of Command' && wordingParagraphs({rulesText:face.rulesText??'',rulesParagraphs:face.rulesParagraphs}).flatMap(p=>p.runs.map(r=>r.text)).join(' ').replace(/\\s+/g,' ').trim()===" +
            JSON.stringify(WORD) +
            ';\n  const run = () => {',
        );
        code = once(
          code,
          'precise.lines.length <= legacy.lines.length',
          'precise.lines.length <= (reviewedWordRows ? Math.max(7,legacy.lines.length) : legacy.lines.length)',
        );
      } else if (file === 'early-text-tiers.ts') {
        code = once(
          source,
          '  options = { ...reviewedOriginalTextLayout(face, reference), ...options };',
          "  const reviewed={...reviewedOriginalTextLayout(face,reference)};\n  if ((globalThis as any).__abuFlow?.howlZero && face.name==='Howl from Beyond') delete reviewed.centeredDy;\n  options={...reviewed,...options};",
        );
        code = once(
          code,
          '  let chosen: RulesLayout | undefined;',
          "  if ((globalThis as any).__abuFlow?.keywordFixed && !forceSmall && characters<=117 && paragraphs.length===2 && paragraphs.every(p=>p.role==='rules' && (p.align===undefined || p.align==='left')) && paragraphs[0]!.runs.map(r=>r.text).join('').length<=15) {\n" +
            "    const keyword=layoutRules(context,paragraphs.map(p=>({...p,align:'left' as const})),{x:80,y:y+6,width:options.largeFitWidth??374,height:height-8},32.5,32.5,{...typography,leading:1.1,balanceLines:true,centerOffset:0});\n" +
            '    if (!keyword.overflow && keyword.lines.length<=5) return keyword;\n  }\n  let chosen: RulesLayout | undefined;',
        );
        code = once(
          code,
          'textWidth: options.denseWidth ?? 0.98',
          'textWidth: options.denseWidth ?? ((globalThis as any).__abuFlow?.preciseOne && fractionalMetrics ? 1 : 0.98)',
        );
        code = once(
          code,
          '{ ...request.typography, fractionalMetrics: true, maximumLines: original.lines.length },',
          '{ ...request.typography, ...((globalThis as any).__abuFlow?.preciseOne && original.size<19 ? {textWidth:1} : {}), fractionalMetrics: true, maximumLines: original.lines.length },',
        );
      } else return;
      const item = { before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
