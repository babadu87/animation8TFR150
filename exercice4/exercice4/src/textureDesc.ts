export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  w: number;
  h: number;
}

export interface IArea extends IPoint, ISize {
}

export interface ISpriteDesc {
  frame: IArea;
  sourceSize: ISize;
  pivot: IPoint;
}

export interface IFramesSection {
  [name: string]: ISpriteDesc;
}

export interface IMetaSection {
  size: ISize;
}

export interface ISpriteDescFile {
  frames: IFramesSection;
  meta: IMetaSection;
}
