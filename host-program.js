// Host-owned compiler. No GL bindings or state snapshots survive an await.
export async function hostProgram(gl, vertex, fragment, signal) {
  signal.throwIfAborted();
  const program = gl.createProgram();
  if (!program) throw Error('Program allocation failed');
  const shaders = [];
  let timer;
  try {
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ]) {
      const shader = gl.createShader(type);
      if (!shader) throw Error('Shader allocation failed');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    const parallel = gl.getExtension('KHR_parallel_shader_compile');
    gl.linkProgram(program);
    gl.flush();
    await new Promise((resolve, reject) => {
      const abort = () => finish(signal.reason);
      const lost = () => finish(new DOMException('Context lost', 'AbortError'));
      const finish = (error) => {
        clearTimeout(timer);
        signal.removeEventListener('abort', abort);
        gl.canvas.removeEventListener('webglcontextlost', lost);
        if (error) reject(error);
        else resolve();
      };
      const poll = () => {
        try {
          signal.throwIfAborted();
          if (gl.isContextLost()) return lost();
          if (parallel && !gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
            timer = setTimeout(poll, 8);
            return;
          }
          if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw Error(
              [gl.getProgramInfoLog(program), ...shaders.map((s) => gl.getShaderInfoLog(s))]
                .filter(Boolean)
                .join('\n') || 'Program linking failed',
            );
          finish();
        } catch (error) {
          finish(error);
        }
      };
      signal.addEventListener('abort', abort, { once: true });
      gl.canvas.addEventListener('webglcontextlost', lost, { once: true });
      timer = setTimeout(poll, 0);
    });
    signal.throwIfAborted();
    return program;
  } catch (error) {
    if (!gl.isContextLost()) gl.deleteProgram(program);
    throw error;
  } finally {
    if (!gl.isContextLost()) for (const shader of shaders) gl.deleteShader(shader);
  }
}
