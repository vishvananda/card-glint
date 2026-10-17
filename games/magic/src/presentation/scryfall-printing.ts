import type { RenderedCardInput } from './face-layout.js';
export interface ScryfallPrintingAppearance {
  set?: string;
  frame?: string;
  frame_effects?: readonly string[] | null;
  border_color?: string | null;
  security_stamp?: string | null;
  textless?: boolean;
}
/** Physical printing flags only; never infer a special frame from card name,
 * color identity, rules wording, or membership in a mixed-treatment set. */
export function resolveScryfallPrinting(
  value: ScryfallPrintingAppearance,
): Partial<RenderedCardInput> {
  const result: Partial<RenderedCardInput> = {
    setCode: value.set?.toUpperCase(),
    symbolStyle: 'original',
  };
  if (value.frame === 'future') {
    result.frameTemplate = 'future';
    if (value.textless) result.futureTreatment = 'full-art';
  } else if (value.frame === '1993' || value.frame === '1997') result.frameStyle = 'retro';
  else if (value.frame === '2003') {
    result.frameStyle = 'modern';
    result.frameAssetFamily = 'eighth';
  } else if (value.frame === '2015') result.frameStyle = 'modern';
  if (value.frame_effects?.includes('colorshifted')) {
    result.frameStyle = 'modern';
    result.frameAssetFamily = 'eighth';
    result.frameTreatment = 'colorshifted';
    delete result.frameTemplate;
    delete result.futureTreatment;
  }
  if (['black', 'white', 'silver'].includes(value.border_color ?? ''))
    result.borderColor = value.border_color as RenderedCardInput['borderColor'];
  if (
    value.security_stamp &&
    ['none', 'oval', 'triangle', 'acorn', 'circle', 'arena', 'heart'].includes(value.security_stamp)
  )
    result.securityStamp = value.security_stamp as RenderedCardInput['securityStamp'];
  else result.securityStamp = 'none';
  return result;
}
