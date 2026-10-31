/** A host chooses the preparation cost without changing the card's content. */
export type FinishQuality = 'full' | 'reduced';
export type FinishQualityPreference = FinishQuality | 'auto';

/** Detection is deliberately narrow. Browser names and generic Mesa drivers
 * say nothing about acceleration. Unknown/private identities retain full detail. */
export function finishQuality(
  gl: WebGL2RenderingContext,
  preference: FinishQualityPreference = 'full',
): FinishQuality {
  if (!['auto', 'full', 'reduced'].includes(preference)) throw RangeError('Invalid finish quality');
  if (preference !== 'auto') return preference;
  const software =
    /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|basic render driver/i;
  if (software.test(String(gl.getParameter(gl.RENDERER)))) return 'reduced';
  const debug = gl.getExtension('WEBGL_debug_renderer_info');
  return debug && software.test(String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)))
    ? 'reduced'
    : 'full';
}
