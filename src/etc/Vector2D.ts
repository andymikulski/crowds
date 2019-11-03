export default class Vector2D {
  public values: number[] = [0, 0];
  constructor(initial?: number[] | Vector2D) {
    if (!initial) {
      this.values = [0, 0];
    } else if (Array.isArray(initial)) {
      this.values = [...initial];
    } else {
      this.values = [...initial.values];
    }
  }

  public static toString(vec: Vector2D) {
    return `Vector2D(${vec.values.join(', ')})`
  }

  public toString() {
    return Vector2D.toString(this);
  }

  public static mult(vec: Vector2D, val: Vector2D | number) {
    if (typeof val === 'number') {
      vec.values[0] *= val;
      vec.values[1] *= val;
    }
    else {
      vec.values[0] *= val.values[0];
      vec.values[1] *= val.values[1];
    }

    return vec;
  }
  public static addMultiple(vec: Vector2D, ...vals: Vector2D[]) {
    for (let i = 0; i < vals.length; i++) {
      vec.values[0] += vals[i].values[0];
      vec.values[1] += vals[i].values[1];
    }
    return vec;
  }

  public static add(vec: Vector2D, val: Vector2D | number) {
    if (typeof val === 'number') {
      vec.values = vec.values.map(x => x + val);
    }
    else {
      vec.values[0] += val.values[0];
      vec.values[1] += val.values[1];
    }
    return vec;
  }
  public static sub(vec: Vector2D, val: Vector2D | number) {
    if (typeof val === 'number') {
      vec.values = vec.values.map(x => x - val);
    }
    else {
      vec.values[0] -= val.values[0];
      vec.values[1] -= val.values[1];
    }
    return vec;
  }
  public static dist(vec: Vector2D, other: Vector2D) {
    return Math.sqrt(((other.values[0] - vec.values[0]) * (other.values[0] - vec.values[0]))
      + ((other.values[1] - vec.values[1]) * (other.values[1] - vec.values[1])));
  }

  public static squaredDist(vec: Vector2D, other: Vector2D) {
    return ((other.values[0] - vec.values[0]) * (other.values[0] - vec.values[0]))
      + ((other.values[1] - vec.values[1]) * (other.values[1] - vec.values[1]));
  }

  public static normalize(vec: Vector2D) {
    Vector2D.mult(vec, 1 / Vector2D.magnitude(vec));
    return vec;
  }
  public static limit(vec: Vector2D, maxVal: number) {
    Vector2D.normalize(vec);
    Vector2D.mult(vec, maxVal);
    return vec;
  }
  public static magnitude(vec: Vector2D): number {
    return Math.sqrt(vec.values[0] * vec.values[0] + vec.values[1] * vec.values[1]);
  }
  public static div(vec: Vector2D, val: number) {
    return Vector2D.mult(vec, 1 / val);
  }
  public dist(other: Vector2D) {
    return Vector2D.dist(this, other);
  }
  public div(val: number) {
    return Vector2D.mult(this, 1 / val);
  }
  public mult(val: Vector2D | number) {
    return Vector2D.mult(this, val);
  }
  public add(val: Vector2D | number) {
    return Vector2D.add(this, val);
  }
  public addMultiple(...vals: Vector2D[]) {
    return Vector2D.addMultiple(this, ...vals);
  }
  public sub(val: Vector2D | number) {
    return Vector2D.sub(this, val);
  }
  public magnitude() {
    return Vector2D.magnitude(this);
  }
  public normalize() {
    return Vector2D.normalize(this);
  }
  public limit(maxVal: number) {
    return Vector2D.limit(this, maxVal);
  }
}
