import { GL } from './models/modelTemplate';
import { loadAsync } from './main';

function createVertexShader(source: string) {
  const vs = GL.createShader(GL.VERTEX_SHADER);
  GL.shaderSource(vs, source);
  GL.compileShader(vs);

  const error = GL.getShaderInfoLog(vs);
  if (error.length > 0)
    alert(error);

  return vs;
}

function createFragmentShader(source: string) {
  const fs = GL.createShader(GL.FRAGMENT_SHADER);
  GL.shaderSource(fs, source);
  GL.compileShader(fs);

  const error = GL.getShaderInfoLog(fs);
  if (error.length > 0)
    alert(error);

  return fs;
}

function linkShaders(vs: WebGLShader, fs: WebGLShader) {
  const shader = GL.createProgram();
  GL.attachShader(shader, vs);
  GL.attachShader(shader, fs);
  GL.linkProgram(shader);

  const error = GL.getProgramInfoLog(shader);
  if (error.length > 0)
    alert(error);

  return shader;
}

export function loadShader(vert: string, frag: string) {
  let vs: WebGLShader;
  let fs: WebGLShader;

  return loadAsync(vert)
    .then((xhr) => {
      vs = createVertexShader(xhr.responseText);
      return loadAsync(frag);
    })
    .then((xhr) => {
      fs = createFragmentShader(xhr.responseText);
      return linkShaders(vs, fs);
    });
}