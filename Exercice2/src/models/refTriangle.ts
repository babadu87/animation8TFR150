import { GL, BaseModel } from './modelTemplate';
import { mat4 } from 'gl-matrix';
import { vec4 } from 'gl-matrix';

export class RefTriangle extends BaseModel {
  private angle = 0;

  vsSource = 'base.vert';
  fsSource = 'base.frag';
  private CouleurLoc: WebGLUniformLocation;
  vertices = [
    -0.5, Math.sin(Math.PI / 3), 0,
    1, 0, 0,
    -0.5, -Math.sin(Math.PI / 3), 0,
  ];
  verticesStride = 3 * 4; // 3 composants * 32 bits
  indices = [0, 1, 2];
  
  updateLogic(delta: number) {
    this.angle += delta;
    mat4.fromZRotation(this.modelView, this.angle);
  }
  postLoad(shader: WebGLProgram) {
    this.CouleurLoc = GL.getUniformLocation(shader, 'Couleur');
    return Promise.resolve();
  }

  drawSetup() {
    GL.uniform4fv(this.CouleurLoc, vec4.fromValues(1.0, 0.0, 0.0, 1.0));
  }
};

export class TexturedTriangle extends RefTriangle {
  private texture: WebGLTexture;
  private textureUniform: WebGLUniformLocation;
  private vertexUVAttrib: number;

  vsSource = 'textured.vert';
  fsSource = 'textured.frag';
  vertices = [
    -0.5, Math.sin(Math.PI / 3), 0, 1, 0,
    1, 0, 0, 0.5, 1,
    -0.5, -Math.sin(Math.PI / 3), 0, 0, 0,
  ];
  verticesStride = 5 * 4; // 5 composants * 32 bits

  load() {
    this.loadTexture("img_tree");
    return Promise.resolve();
  }

  postLoad(shader: WebGLProgram) {
    this.vertexUVAttrib = GL.getAttribLocation(shader, 'aVertexUV');
    this.textureUniform = GL.getUniformLocation(shader, 'uTexture');
    return Promise.resolve();
  }

  drawSetup() {
    GL.enableVertexAttribArray(this.vertexUVAttrib);
    GL.vertexAttribPointer(this.vertexUVAttrib, 2, GL.FLOAT, false, 5 * 4, 3 * 4);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D, this.texture);
    GL.uniform1i(this.textureUniform, 0);
    GL.enable(GL.BLEND);
    GL.blendFunc(GL.ONE, GL.ZERO);
  }

  postDraw() {
    GL.disableVertexAttribArray(this.vertexUVAttrib);
  }

  private loadTexture(name: string) {
    const image = document.getElementById(name) as HTMLImageElement;
    this.texture = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, this.texture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.bindTexture(GL.TEXTURE_2D, null);
  }
}

export class ColorTriangle extends RefTriangle { 
  private colorBuffer : WebGLBuffer;
  vertexcolor : number;
  vsSource = 'color.vert';
  fsSource = 'color.frag';
  vertices = [
    -0.5, Math.sin(Math.PI / 3), 0, 1, 0,
    1, 0, 0, 0.5, 1,
    -0.5, -Math.sin(Math.PI / 3), 0, 0, 0,
  ];
  verticesStride = 5 * 4; // 5 composants * 32 bits

  colors = [
    1.0,  0.0,  0.0,  1.0,    // rouge
    0.0,  1.0,  0.0,  1.0,    // vert
    0.0,  0.0,  1.0,  1.0,    // bleu
  ];

  load() {
    this.colorBuffer = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, this.colorBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(this.colors), GL.STATIC_DRAW);
    return Promise.resolve();
  }
  postLoad(shader: WebGLProgram) {
    this.vertexcolor = GL.getAttribLocation(shader, 'aVertexColor')
    return Promise.resolve();
  }

  drawSetup() {
    const numComponents = 4;
    const type = GL.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    GL.bindBuffer(GL.ARRAY_BUFFER, this.colorBuffer);
    GL.vertexAttribPointer(this.vertexcolor,numComponents,type,normalize,stride,offset);
    GL.enableVertexAttribArray(this.vertexcolor);
  }
  postDraw(){
    
    GL.disableVertexAttribArray(this.vertexcolor);
  }
}