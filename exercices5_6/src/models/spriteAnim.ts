import { GL, BaseModel } from './modelTemplate';
import { ISpriteDescFile } from '../textureDesc';
import { ISequence, NullAction, MyScene } from './spriteAnimScenario';
import { loadAsync } from '../main';
import { mat4 } from 'gl-matrix';

export interface ISceneEntry {
  sprite: string;
  anim: string;
  x: number;
  y: number;
  z?: number;
  frameLength: number;
  sequence: ISequence[];
}

export class Sprite {
  private anim: string;
  private frame = 0;
  private frameLength: number;
  public x: number;
  public y: number;
  public z: number;
  private name: string;
  private sequence: ISequence[];
  private currentAction = NullAction;
  private elapsed = 0;

  vertices: number[];

  constructor(
    private spriteDesc: ISpriteDescFile,
    descr: ISceneEntry,
  ) {
    this.name = descr.sprite;
    this.anim = descr.anim;
    this.x = descr.x;
    this.y = descr.y;
    this.z = descr.z || 0;
    this.frameLength = descr.frameLength;
    this.sequence = descr.sequence;
    this.tick(0);
  }

  tick(delta: number) {
    if (this.sequence.length > 0 && this.elapsed >= this.sequence[0].time) {
      this.currentAction = this.sequence.shift().action;
    }
    this.elapsed += delta;
    this.currentAction(this, delta);

    const frameDesc = this.spriteDesc.frames[this.frameName()];

    this.vertices = [
      this.x - 8, this.y - 8, this.z, 0, 0,
      this.x + 8, this.y - 8, this.z, 1, 0,
      this.x + 8, this.y + 8, this.z, 1, 1,
      this.x - 8, this.y + 8, this.z, 0, 1,
    ];
  }

  private frameName() {
    return `${this.name}/${this.anim}/${this.frame}`;
  }

  public setAnim(anim: string) {
    this.anim = anim;
    this.frame = 0;
  }
}

export class SpriteAnim extends BaseModel {
  private texture: WebGLTexture;
  private textureUniform: WebGLUniformLocation;
  private vertexUVAttrib: number;

  private spriteDesc: ISpriteDescFile;
  private sprites: Sprite[] = [];

  vsSource = 'textured.vert';
  fsSource = 'textured.frag';
  verticesStride = 5 * 4; // 5 composants * 32 bits
  vertices: number[] = [];
  indices: number[] = [];

  updateLogic(delta: number) {
    const spriteVerts: number[][] = [];
    this.indices.length = 0;

    for (let i = 0; i < this.sprites.length; i++) {
      const s = this.sprites[i];
      s.tick(delta);
      spriteVerts.push(s.vertices);

      /*
        0     1
         +---+
         |\  |
         | \ |
         |  \|
         +---+
        3     2
      */
      const offset = i * 4;
      this.indices.push(offset, offset + 1, offset + 2, offset + 2, offset + 3, offset);
    }

    this.vertices = [].concat(...spriteVerts);
  }

  load() {
    mat4.ortho(this.modelView, -72, 72, -128, 16, -1, 1);
    this.loadTexture('img_mario');
    return loadAsync('images/mario.json', 'application/json')
      .then((xhr) => {
        this.spriteDesc = JSON.parse(xhr.responseText);
        this.createScene();
      });
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
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
  }

  vertexChanged() {
    return true;
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

  private createScene() {
    for (let entry of MyScene) {
      this.sprites.push(new Sprite(this.spriteDesc, entry));
    }
  }
}