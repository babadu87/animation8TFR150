import { mat4 } from 'gl-matrix';

export let GL: WebGLRenderingContext;

export function SetGL(glCtx: WebGLRenderingContext) {
  GL = glCtx;
}

export interface IModel {
  vsSource: string;
  fsSource: string;
  vertices: number[];
  verticesStride: number;
  indices: number[];
  modelView: mat4;

  load(): Promise<any>;
  postLoad(shader: WebGLProgram): Promise<any>;
  updateLogic(delta: number): void;
  drawSetup(delta: number): void;
  postDraw(): void;
}

export abstract class ModeleBase {
  verticesStride: number;
  modelView = mat4.create();

  load() {
    return Promise.resolve();
  }

  postLoad(shader: WebGLProgram) {
    return Promise.resolve();
  }

  updateLogic(delta: number) {
  }

  drawSetup() {
  }

  postDraw() {
  }
}