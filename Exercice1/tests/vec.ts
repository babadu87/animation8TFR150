import { Vector } from '../src/vec';
import { expect } from 'chai';
import 'mocha';

describe('Vector', () => {
  it('peut être créé', () => {
    const v = new Vector(1, 2, 3);
    expect(v.x).equals(1);
    expect(v.y).equals(2);
    expect(v.z).equals(3);
  });

  it('peut être comparé', () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(1, 2, 3);
    const v3 = new Vector(2, 4, 6);
    expect(v1.equals(v2)).true;
    expect(v1.equals(v3)).false;
  });

  it('peut être multiplié par un scalaire', () => {
    const v = new Vector(1, 2, 3);
    const vExpected = new Vector(3, 6, 9);
    const vResult = v.mul(3);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peut calculer une mise à l\'échelle hétérogène', () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 8);
    const vExpected = new Vector(4, 10, 24);
    const vResult = v1.mul(v2);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peuvent être additionnés', () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(2, 4, 8);
    const vExpected = new Vector(3, 6, 11);
    const vResult = v1.add(v2);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peuvent être soustraits', () => {
    const v1 = new Vector(2, 4, 8);
    const v2 = new Vector(1, 2, 3);
    const vExpected = new Vector(1, 2, 5);
    const vResult = v1.sub(v2);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peut retourner sa magnitude au carré', () => {
    const v = new Vector(1, 2, 3);
    const result = v.sqMagnitude();
    expect(result).a("number");
    expect(result).equals(14);
  });

  it('peut retourner sa magnitude', () => {
    const v = new Vector(1, 2, 3);
    const result = v.magnitude();
    expect(result).a("number");
    expect(result).approximately(3.74, 0.01);
  });

  it('peut être normalisé', () => {
    const v = new Vector(1, 2, 3);
    const vResult = v.normalized();
    const vCheck = vResult.mul(v.magnitude());
    expect(vResult).instanceOf(Vector);
    expect(vResult.magnitude()).approximately(1, 0.001);
    expect(vCheck.equals(v));
  });

  it('peut calculer un produit scalaire', () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 8);
    const result = v1.dot(v2);
    expect(result).a("number");
    expect(result).equals(38);
  });

  it('peut calculer un produit croisé', () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 8);
    const vExpected = new Vector(1, 4, -3);
    const vResult = v1.cross(v2);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });

  it('peut calculer une interpolation linéaire', () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 8);
    const vExpected = new Vector(2.2, 3.2, 5);
    const vResult = v1.lerp(v2, 0.4);
    expect(vResult).instanceOf(Vector);
    expect(vResult.equals(vExpected)).true;
  });
});