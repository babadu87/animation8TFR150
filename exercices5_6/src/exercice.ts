import { Logic, loadAsync } from './main';
import { loadShader } from './shaderLoad';
import { GL, SetGL, IModel } from './models/modelTemplate';
import { RefTriangle, TexturedTriangle } from './models/refTriangle';
import { SpriteAnim } from './models/spriteAnim';
import { VectorAnim } from './models/vecAnim';
import { mat4 } from 'gl-matrix';

export class Exercice extends Logic {
  private currentModel: IModel;
  private models: { [name: string]: IModel } = {
    redTriangle: new RefTriangle(),     // (Référence) Triangle Rouge
    blueSquare: undefined,      // 2.1 Carré bleu
    colorTriangle: undefined,   // 2.2 Triangle coloré
    yellowParabola: undefined,  // 2.3 Parabole jaune
    yellowParabola2: undefined, // 2.4 Parabole oscillante
    texturedTriangle: new TexturedTriangle(),// (Référence) Triangle texturé
    texturedSquare: undefined,  // 3.1 Carré texturé
    spriteAnim: new SpriteAnim(),  // 4 Animation de sprites
    vectorAnim: new VectorAnim(), // 5 Animation vectorielle
    massSpring: undefined,      // 6 Système masse-ressort
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
        return loadShader(
          `shaders/${this.currentModel.vsSource}`,
          `shaders/${this.currentModel.fsSource}`
        );
      })
      .then((shader) => {
        this.shader = shader;
        GL.useProgram(this.shader);
        this.vertexPositionAttrib = GL.getAttribLocation(this.shader, 'aVertexPosition');
        this.pUniform = GL.getUniformLocation(this.shader, 'uPMatrix');
        this.mvUniform = GL.getUniformLocation(this.shader, 'uMVMatrix');
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

    if (this.currentModel.vertexChanged()) {
      const vertices = new Float32Array(this.currentModel.vertices);
      const indices = new Uint16Array(this.currentModel.indices);
      GL.bufferData(GL.ARRAY_BUFFER, vertices, GL.DYNAMIC_DRAW);
      GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, indices, GL.DYNAMIC_DRAW);
    }

    GL.useProgram(this.shader);

    GL.enableVertexAttribArray(this.vertexPositionAttrib);
    GL.vertexAttribPointer(this.vertexPositionAttrib, 3, GL.FLOAT, false, this.currentModel.verticesStride, 0);

    GL.uniformMatrix4fv(this.pUniform, false, this.projection);
    GL.uniformMatrix4fv(this.mvUniform, false, this.currentModel.modelView);

    this.currentModel.drawSetup(delta);

    GL.drawElements(GL.TRIANGLES, this.currentModel.indices.length, GL.UNSIGNED_SHORT, 0);

    this.currentModel.postDraw();

    GL.disableVertexAttribArray(this.vertexPositionAttrib);

    this.currentModel.debugDraw(this.vertexBuffer, this.projection);
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