import { Vector } from '../src/vec';
import { Matrix } from '../src/matrix';
import { radians } from '../src/utils';
import { expect } from 'chai';
import 'mocha';

describe('Matrix', () => {
  it('peut créer une matrice identité', () => {
    const m = Matrix.identity();
    expect(m).instanceOf(Matrix);
    const v = new Vector(1, 2, 3);
    const vResult = m.mul(v);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(v)).true;
  });

  it('peut créer une matrice de mise à l\'échelle', () => {
    const m = Matrix.fromScale(4, 5, 8);
    expect(m).instanceOf(Matrix);
    const v = new Vector(1, 2, 3);
    const vExpected = new Vector(4, 10, 24);
    const vResult = m.mul(v);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  describe('peut créer une matrice de rotation depuis des angles d\'Euler', () => {
    interface ITest {
      name: string,
      expected: Vector,
      fn: (rad: number) => Matrix,
    }

    const tests: ITest[] = [
      {
        name: "Pitch",
        expected: new Vector(1, -3, 2),
        fn: Matrix.fromPitch
      },
      {
        name: "Yaw",
        expected: new Vector(3, 2, -1),
        fn: Matrix.fromYaw
      },
      {
        name: "Roll",
        expected: new Vector(-2, 1, 3),
        fn: Matrix.fromRoll
      },
    ];
    for (let test of tests) {
      it(test.name, () => {
        const mRot = test.fn(radians(30));
        const mFullRot = mRot.mul(mRot).mul(mRot);
        const v = new Vector(1, 2, 3);
        const vResult = mFullRot.mul(v);
        expect(vResult).instanceOf(Vector);
        expect(vResult.equals(test.expected)).true;
      });
    }
  });

  it('peut créer un matrice de translation', () => {
    const m = Matrix.fromTranslation(2, 4, 8);
    expect(m).instanceOf(Matrix);
    const v = new Vector(1, 2, 3);
    const vExpected = new Vector(3, 6, 11);
    const vResult = m.mul(v);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peut composer des matrices', () => {
    const mTranslate = Matrix.fromTranslation(2, 4, 8);
    const mScale = Matrix.fromScale(4, 5, 8);
    const v = new Vector(1, 2, 3);
    const mBoth = mTranslate.mul(mScale);
    const vExpected = new Vector(6, 14, 32);
    const vResult = mBoth.mul(v);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peut inverser une matrice', () => {
    const mTranslate = Matrix.fromTranslation(2, 4, 8);
    const mScale = Matrix.fromScale(4, 5, 8);
    const v = new Vector(1, 2, 3);
    const mBoth = mTranslate.mul(mScale);
    const vComposed = mBoth.mul(v);
    const mInverse = mBoth.inverse();
    const vResult = mInverse.mul(vComposed);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(v)).true;
  });
});