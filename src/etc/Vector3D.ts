export default class Vector3D {
  private static pool: Vector3D[] = [];
  private static _next:Vector3D;
  public static get(initial?: number[] | Vector3D):Vector3D {
    if (Vector3D.pool.length) {
      Vector3D._next = Vector3D.pool.pop();
    } else {
      Vector3D._next = new Vector3D();
    }
    Vector3D._next.values.length = 0;
    Vector3D._next.values.push.apply(Vector3D._next.values);
    return Vector3D._next;
  }

  public values: number[] = [0, 0, 0];
  private constructor(initial?: number[] | Vector3D) {
    if (!initial) {
      this.values = [0, 0, 0];
    } else if (Array.isArray(initial)) {
      this.values = [...initial];
    } else {
      this.values = [...initial.values];
    }
  }


  public static toString(vec: Vector3D) {
    return `Vector3D(${vec.values.join(', ')})`
  }

  public toString() {
    return Vector3D.toString(this);
  }


  public static mult(vec: Vector3D, val: Vector3D | number) {
    if (typeof val === 'number') {
      vec.values[0] *= val;
      vec.values[1] *= val;
      vec.values[2] *= val;
    }
    else {
      vec.values[0] *= val.values[0];
      vec.values[1] *= val.values[1];
      vec.values[2] *= val.values[2];
    }

    return vec;
  }

  public static addMultiple(vec: Vector3D, ...vals: Vector3D[]) {
    for (let i = 0; i < vals.length; i++) {
      vec.values[0] += vals[i].values[0];
      vec.values[1] += vals[i].values[1];
      vec.values[2] += vals[i].values[2];
    }

    return vec;
  }

  public static add(vec: Vector3D, val: Vector3D | number) {
    if (typeof val === 'number') {
      vec.values = vec.values.map(x => x + val);
    }
    else {
      vec.values[0] += val.values[0];
      vec.values[1] += val.values[1];
      vec.values[2] += val.values[2];
    }
    return vec;
  }
  public static sub(vec: Vector3D, val: Vector3D | number) {
    if (typeof val === 'number') {
      vec.values = vec.values.map(x => x - val);
    }
    else {
      vec.values[0] -= val.values[0];
      vec.values[1] -= val.values[1];
      vec.values[2] -= val.values[2];
    }
    return vec;
  }
  public static dist(vec: Vector3D, other: Vector3D) {
    return Math.sqrt(((other.values[0] - vec.values[0]) * (other.values[0] - vec.values[0]))
      + ((other.values[1] - vec.values[1]) * (other.values[1] - vec.values[1]))
      + ((other.values[2] - vec.values[2]) * (other.values[2] - vec.values[2])));
  }

  public static squaredDist(vec: Vector3D, other: Vector3D) {
    return ((other.values[0] - vec.values[0]) * (other.values[0] - vec.values[0]))
      + ((other.values[1] - vec.values[1]) * (other.values[1] - vec.values[1]))
      + ((other.values[2] - vec.values[2]) * (other.values[2] - vec.values[2]));
  }

  public static normalize(vec: Vector3D) {
    Vector3D.mult(vec, 1 / Vector3D.magnitude(vec));
    return vec;
  }
  public static limit(vec: Vector3D, maxVal: number) {
    Vector3D.normalize(vec);
    Vector3D.mult(vec, maxVal);
    return vec;
  }
  public static magnitude(vec: Vector3D): number {
    return Math.sqrt(vec.values[0] * vec.values[0] + vec.values[1] * vec.values[1] + vec.values[2] * vec.values[2]);
  }
  public static div(vec: Vector3D, val: number) {
    return Vector3D.mult(vec, 1 / val);
  }
  public dist(other: Vector3D) {
    return Vector3D.dist(this, other);
  }
  public div(val: number) {
    return Vector3D.mult(this, 1 / val);
  }
  public mult(val: Vector3D | number) {
    return Vector3D.mult(this, val);
  }
  public add(val: Vector3D | number) {
    return Vector3D.add(this, val);
  }
  public addMultiple(...vals: Vector3D[]) {
    return Vector3D.addMultiple(this, ...vals);
  }
  public sub(val: Vector3D | number) {
    return Vector3D.sub(this, val);
  }
  public magnitude() {
    return Vector3D.magnitude(this);
  }
  public normalize() {
    return Vector3D.normalize(this);
  }
  public limit(maxVal: number) {
    return Vector3D.limit(this, maxVal);
  }
}
