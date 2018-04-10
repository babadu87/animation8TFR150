import { Sprite, ISceneEntry } from './spriteAnim';

export interface IAction {
  (sprite: Sprite, delta: number): void;
}

export const NullAction: IAction = () => { };

export interface ISequence {
  time: number;
  action: IAction;
}

const CoinSequence: ISequence[] = [
  {
    time: 2.5,
    action: (sprite: Sprite, delta: number) => {
      sprite.y -= delta * 192;
    }
  },
  {
    time: 2.75,
    action: NullAction
  },
  {
    time: 3.25,
    action: (sprite: Sprite, delta: number) => {
      sprite.y += delta * 192;
    }
  },
  {
    time: 3.5,
    action: NullAction
  }
];

const BlockSequence: ISequence[] = [
  {
    time: 2.5,
    action: (sprite: Sprite) => { sprite.setAnim('Empty'); }
  },
  {
    time: 3,
    action: NullAction,
  }
];

const MarioSequence: ISequence[] = [
  {
    time: 0,
    action: (sprite: Sprite, delta: number) => {
      sprite.x += delta * 32;
    }
  },
  {
    time: 2,
    action: (sprite: Sprite, delta: number) => {
      sprite.setAnim('Jump');
      sprite.x += delta * 32;
      sprite.y -= delta * 44;
    }
  },
  {
    time: 2.5,
    action: (sprite: Sprite, delta: number) => {
      sprite.x += delta * 32;
      sprite.y += delta * 44;
    }
  },
  {
    time: 3,
    action: (sprite: Sprite, delta: number) => {
      sprite.setAnim('Walk');
      sprite.x += delta * 32;
    }
  },
];

export const MyScene: ISceneEntry[] = [
  { sprite: 'Coin', anim: 'Default', x: 16, y: -48, z: 0.5, frameLength: 0, sequence: CoinSequence },
  { sprite: 'Block', anim: 'Question', x: 16, y: -48, frameLength: 0.25, sequence: BlockSequence },
  { sprite: 'Mario', anim: 'Walk', x: -64, y: 0, frameLength: 0.1, sequence: MarioSequence },
];
