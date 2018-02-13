function approx(a: number, b: number, epsilon: number): boolean {
  return Math.abs(a - b) < epsilon;
};

export class Vector {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {
  }

  equals(other: Vector, epsilon: number = 0.001): boolean {
    return (
      approx(this.x, other.x, epsilon) &&
      approx(this.y, other.y, epsilon) &&
      approx(this.z, other.z, epsilon)
    );
  }

  mul<T extends number | Vector>(s: T): Vector {
    if (s instanceof Vector) {
      return this.mulVector(s);
    }
    return this.mulScalar(<number> s);
  }

  private mulVector(v: Vector): Vector {
    return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
  }

  private mulScalar(s: number): Vector {
    return new Vector(this.x * s, this.y * s, this. z * s);
  }

  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  sub(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  sqMagnitude(): number {
    return (this.x * this.x) + (this.y * this.y) + (this.z * this.z);
  }

  magnitude(): number {
    return Math.sqrt(this.sqMagnitude());
  }

  normalized(): Vector {
    return new Vector(this.x / this.magnitude(), this.y / this.magnitude(), this.z / this.magnitude());
  }

  dot(other: Vector): number {
    return (this.x * other.x) + (this.y * other.y) + (this.z * other.z);
  }

  cross(other: Vector): Vector {
    return new Vector((this.y * other.z)-(this.z * other.y), (this.z * other.x)-(this.x * other.z), (this.x * other.y) - (this.y * other.x));
  }

  lerp(other: Vector, t: number) {
    return new Vector((Math.abs(this.x - other.x)*t)+this.x, (Math.abs(this.y - other.y)*t)+this.y, (Math.abs(this.z - other.z)*t)+this.z);
  }
}