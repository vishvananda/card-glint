/** Preparation is infrequent; preserve host state rather than relying on defaults. */
export function withFinishTextureState<T>(gl: WebGL2RenderingContext, prepare: () => T): T {
  if (
    gl.getParameter(gl.TRANSFORM_FEEDBACK_ACTIVE) &&
    !gl.getParameter(gl.TRANSFORM_FEEDBACK_PAUSED)
  )
    throw Error('Finish preparation requires paused transform feedback');
  for (const target of [gl.ANY_SAMPLES_PASSED, gl.ANY_SAMPLES_PASSED_CONSERVATIVE])
    if (gl.getQuery(target, gl.CURRENT_QUERY))
      throw Error('Finish preparation cannot run inside an occlusion query');
  const active = gl.getParameter(gl.ACTIVE_TEXTURE) as number;
  const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram | null;
  if (program && gl.getProgramParameter(program, gl.DELETE_STATUS))
    throw Error('Finish preparation requires an undeleted current program');
  const vao = gl.getParameter(gl.VERTEX_ARRAY_BINDING) as WebGLVertexArrayObject | null;
  const elements = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING) as WebGLBuffer | null;
  const read = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
  const draw = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING) as WebGLFramebuffer | null;
  const unpack = gl.getParameter(gl.PIXEL_UNPACK_BUFFER_BINDING) as WebGLBuffer | null;
  const viewport = gl.getParameter(gl.VIEWPORT) as Int32Array;
  const mask = gl.getParameter(gl.COLOR_WRITEMASK) as boolean[];
  const clear = gl.getParameter(gl.COLOR_CLEAR_VALUE) as Float32Array;
  const blendEquationRgb = gl.getParameter(gl.BLEND_EQUATION_RGB) as number;
  const blendEquationAlpha = gl.getParameter(gl.BLEND_EQUATION_ALPHA) as number;
  const blendSourceRgb = gl.getParameter(gl.BLEND_SRC_RGB) as number;
  const blendSourceAlpha = gl.getParameter(gl.BLEND_SRC_ALPHA) as number;
  const blendDestinationRgb = gl.getParameter(gl.BLEND_DST_RGB) as number;
  const blendDestinationAlpha = gl.getParameter(gl.BLEND_DST_ALPHA) as number;
  const capabilities = [
    gl.BLEND,
    gl.CULL_FACE,
    gl.DEPTH_TEST,
    gl.DITHER,
    gl.SCISSOR_TEST,
    gl.STENCIL_TEST,
    gl.RASTERIZER_DISCARD,
    gl.SAMPLE_ALPHA_TO_COVERAGE,
    gl.SAMPLE_COVERAGE,
  ];
  const enabled = capabilities.map((capability) => gl.isEnabled(capability));
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.getParameter(gl.TEXTURE_BINDING_2D) as WebGLTexture | null;
  const sampler = gl.getParameter(gl.SAMPLER_BINDING) as WebGLSampler | null;
  try {
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
    for (const capability of capabilities) gl.disable(capability);
    return prepare();
  } finally {
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elements);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, read);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, draw);
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, unpack);
    gl.viewport(viewport[0]!, viewport[1]!, viewport[2]!, viewport[3]!);
    gl.colorMask(mask[0]!, mask[1]!, mask[2]!, mask[3]!);
    gl.clearColor(clear[0]!, clear[1]!, clear[2]!, clear[3]!);
    gl.blendEquationSeparate(blendEquationRgb, blendEquationAlpha);
    gl.blendFuncSeparate(
      blendSourceRgb,
      blendDestinationRgb,
      blendSourceAlpha,
      blendDestinationAlpha,
    );
    capabilities.forEach((capability, i) =>
      enabled[i] ? gl.enable(capability) : gl.disable(capability),
    );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindSampler(0, sampler);
    gl.activeTexture(active);
  }
}
