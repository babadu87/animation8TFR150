import { Logic, loadAsync } from './main';
import { mat4 } from 'gl-matrix';

let GL: WebGLRenderingContext;

export class Exercice extends Logic {
  private vertexBuffer: WebGLBuffer;
  private indexBuffer: WebGLBuffer;
  private shader: WebGLProgram;
  private vertexPositionAttrib: number;
  private pUniform: WebGLUniformLocation;
  private mvUniform: WebGLUniformLocation;

  private angle = 0;

  init(canvas: HTMLCanvasElement, ctx: WebGLRenderingContext) {
    GL = ctx;
    GL.clearColor(0, 0, 0, 1);
    GL.viewport(0, 0, canvas.width, canvas.height);

    this.createVertexBuffer();
    this.createIndexBuffer();

    let vs: WebGLShader;
    let fs: WebGLShader;

    return loadAsync('shaders/base.vert')
      .then((xhr) => {
        vs = this.createVertexShader(xhr.responseText);
        return loadAsync('shaders/base.frag');
      })
      .then((xhr) => {
        fs = this.createFragmentShader(xhr.responseText);
        this.linkShaders(vs, fs);
      });
  }

  private createVertexBuffer() {
    this.vertexBuffer = GL.createBuffer();
    const vertices = new Float32Array([
      -0.9, -0.9, 0,
      0.0, 0.9, 0,
      0.9, -0.9, 0,
    ]);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);
  }

  private createIndexBuffer() {
    this.indexBuffer = GL.createBuffer();
    const indices = new Uint16Array([0, 1, 2]);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW);
  }

  private createVertexShader(source: string) {
    const vs = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vs, source);
    GL.compileShader(vs);
    return vs;
  }

  private createFragmentShader(source: string) {
    const fs = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fs, source);
    GL.compileShader(fs);
    return fs;
  }

  private linkShaders(vs: WebGLShader, fs: WebGLShader) {
    this.shader = GL.createProgram();
    GL.attachShader(this.shader, vs);
    GL.attachShader(this.shader, fs);
    GL.linkProgram(this.shader);

    GL.useProgram(this.shader);
    this.vertexPositionAttrib = GL.getAttribLocation(this.shader, 'aVertexPosition');
    this.pUniform = GL.getUniformLocation(this.shader, 'uPMatrix');
    this.mvUniform = GL.getUniformLocation(this.shader, 'uMVMatrix');
  }

  updateLogic(delta: number) {
    this.angle += delta;
  }

  updateOutput(delta: number) {
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.useProgram(this.shader);

    GL.enableVertexAttribArray(this.vertexPositionAttrib);
    GL.vertexAttribPointer(this.vertexPositionAttrib, 3, GL.FLOAT, false, 3 * 4, 0);

    const identity = mat4.create();
    GL.uniformMatrix4fv(this.pUniform, false, identity);

    const rotation = mat4.create();
    mat4.fromZRotation(rotation, this.angle);
    GL.uniformMatrix4fv(this.mvUniform, false, rotation);

    GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);

    GL.disableVertexAttribArray(this.vertexPositionAttrib);
  }
}