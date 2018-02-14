import { Logic, loadAsync } from './main';
import { GL, SetGL, IModel } from './models/modelTemplate';
import { RefTriangle, TexturedTriangle } from './models/refTriangle';
import { RefCarre } from './models/refCarre';
import { mat4 } from 'gl-matrix';

export class Exercice extends Logic {
  private currentModel: IModel;
  private models: { [name: string]: IModel } = {
    redTriangle: new RefTriangle(),     // (Référence) Triangle Rouge
    blueSquare: new RefCarre(),      // 2.1 Carré bleu
    colorTriangle: undefined,   // 2.2 Triangle coloré
    yellowParabola: undefined,  // 2.3 Parabole jaune
    yellowParabola2: undefined, // 2.4 Parabole oscillante
    texturedTriangle: new TexturedTriangle(),// (Référence) Triangle texturé
    texturedSquare: undefined,  // 3.1 Carré texturé
  };

  private ready = false;
  private loaded = false;
  private projection: mat4;

  private vertexBuffer: WebGLBuffer;
  private indexBuffer: WebGLBuffer;
  private shader: WebGLProgram;
  private vertexPositionAttrib: number;
  private pUniform: WebGLUniformLocation;
  private mvUniform: WebGLUniformLocation;

  init(canvas: HTMLCanvasElement, ctx: WebGLRenderingContext) {
    SetGL(ctx);
    GL.clearColor(0.19, 0.30, 0.47, 1);
    GL.viewport(0, 0, canvas.width, canvas.height);
    const ratio = canvas.width / canvas.height;

    this.projection = mat4.create();
    mat4.ortho(this.projection, -ratio, ratio, 1, -1, 0, 1000);

    this.loaded = true;
    return this.reload();
  }

  private reload() {
    if (this.loaded == false)
      return;

    this.ready = false;

    this.createVertexBuffer();
    this.createIndexBuffer();

    let vs: WebGLShader;
    let fs: WebGLShader;

    return this.currentModel.load()
      .then(() => {
        return loadAsync(`shaders/${this.currentModel.vsSource}`);
      })
      .then((xhr) => {
        vs = this.createVertexShader(xhr.responseText);
        return loadAsync(`shaders/${this.currentModel.fsSource}`);
      })
      .then((xhr) => {
        fs = this.createFragmentShader(xhr.responseText);
        this.linkShaders(vs, fs);
      })
      .then(() => {
        return this.currentModel.postLoad(this.shader);
      })
      .then(() => {
        this.ready = true;
      });
  }

  private createVertexBuffer() {
    this.vertexBuffer = GL.createBuffer();
    const vertices = new Float32Array(this.currentModel.vertices);
    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.STATIC_DRAW);
  }

  private createIndexBuffer() {
    this.indexBuffer = GL.createBuffer();
    const indices = new Uint16Array(this.currentModel.indices);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.STATIC_DRAW);
  }

  private createVertexShader(source: string) {
    const vs = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vs, source);
    GL.compileShader(vs);

    const error = GL.getShaderInfoLog(vs);
    if (error.length > 0)
      alert(error);

    return vs;
  }

  private createFragmentShader(source: string) {
    const fs = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fs, source);
    GL.compileShader(fs);

    const error = GL.getShaderInfoLog(fs);
    if (error.length > 0)
      alert(error);

    return fs;
  }

  private linkShaders(vs: WebGLShader, fs: WebGLShader) {
    this.shader = GL.createProgram();
    GL.attachShader(this.shader, vs);
    GL.attachShader(this.shader, fs);
    GL.linkProgram(this.shader);

    const error = GL.getProgramInfoLog(this.shader);
    if (error.length > 0)
      alert(error);

    GL.useProgram(this.shader);
    this.vertexPositionAttrib = GL.getAttribLocation(this.shader, 'aVertexPosition');
    this.pUniform = GL.getUniformLocation(this.shader, 'uPMatrix');
    this.mvUniform = GL.getUniformLocation(this.shader, 'uMVMatrix');
  }

  updateLogic(delta: number) {
    if (!this.ready)
      return;

    this.currentModel.updateLogic(delta);
  }

  updateOutput(delta: number) {
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

    if (!this.ready)
      return;

    GL.bindBuffer(GL.ARRAY_BUFFER, this.vertexBuffer);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    GL.useProgram(this.shader);

    GL.enableVertexAttribArray(this.vertexPositionAttrib);
    GL.vertexAttribPointer(this.vertexPositionAttrib, 3, GL.FLOAT, false, this.currentModel.verticesStride, 0);

    GL.uniformMatrix4fv(this.pUniform, false, this.projection);
    GL.uniformMatrix4fv(this.mvUniform, false, this.currentModel.modelView);

    this.currentModel.drawSetup(delta);

    GL.drawElements(GL.TRIANGLES,this.currentModel.indices.length, GL.UNSIGNED_SHORT, 0);

    this.currentModel.postDraw();

    GL.disableVertexAttribArray(this.vertexPositionAttrib);
  }

  updateContent(newContent: string) {
    if (this.models[newContent]) {
      this.currentModel = this.models[newContent];
      this.reload();
    }
    else
      console.error(`Impossible de trouver le modèle ${newContent}.`);
  }
}