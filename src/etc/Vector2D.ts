export default class Vector2D {

  public static pool: Vector2D[] = [];
  public static totalCount:number = 0;
  public static freeCount:number = 0;
  private static _next:Vector2D;
  public static get(initial?: number[] | Vector2D):Vector2D {
    if (Vector2D.pool.length) {
      Vector2D._next = Vector2D.pool.pop();
    } else {
      Vector2D._next = new Vector2D();
    }

    if (!initial) {
      Vector2D._next.values[0] = Vector2D._next.values[1] = 0;
    } else if (Array.isArray(initial)) {
      Vector2D._next.values[0] = initial[0];
      Vector2D._next.values[1] = initial[1];
    } else {
      Vector2D._next.values[0] = initial.values[0];
      Vector2D._next.values[1] = initial.values[1];
    }
    return Vector2D._next;
  }
  public static free(...vecs:Vector2D[]){
    Array.prototype.push.apply(Vector2D.pool, vecs);
  }

  public values: number[] = [0, 0];
  private constructor(initial?: number[] | Vector2D) {
    Vector2D.totalCount += 1;
    this.values = [];
    if (!initial) {
      this.values = [0, 0];
    } else if (Array.isArray(initial)) {
      this.values = [initial[0], initial[1]];
    } else {
      this.values = [initial.values[0], initial.values[1]];
    }
  }


  public static toString(vec: Vector2D) {
    return `Vector2D(${vec.values.join(', ')})`
  }

  public toString() {
    return Vector2D.toString(this);
  }

  public static flip(vec: Vector2D) {
    const x = vec.values[0];
    const y = vec.values[1];
    vec.values[0] = -x;
    vec.values[1] = -y;

    return vec;
  }

  public static rotate(vec: Vector2D, degrees: number) {
    vec.values[0]
  }

  public static mult(vec: Vector2D, val: Vector2D | number) {
    // console.log('in mult..', JSON.stringify(vec), JSON.stringify(val));
    if (typeof val === 'number') {
      // console.log('..1..', JSON.stringify(vec));
      vec.values[0] *= val;
      vec.values[1] *= val;
      // console.log('..2..', JSON.stringify(vec));
    }
    else {
      // console.log('..3..', JSON.stringify(vec));
      vec.values[0] *= val.values[0];
      vec.values[1] *= val.values[1];
      // console.log('..4..', JSON.stringify(vec));
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

  public static dot(vec: Vector2D, other: Vector2D) {
    return (vec.values[0] * other.values[0]) + (vec.values[0] * vec.values[1]);
  }

  public static cross(vec: Vector2D, other: Vector2D) {
    return (vec.values[0] * other.values[1]) - (vec.values[1] * other.values[0]);
  }

  public static normalize(vec: Vector2D) {
    const mag = vec.magnitude();
    return Vector2D.mult(vec, mag === 0 ? 0 : 1 / mag);
  }
  public static limit(vec: Vector2D, maxVal: number) {
    return vec.normalize().mult(maxVal);
  }
  public static magnitude(vec: Vector2D): number {
    return Math.sqrt(vec.values[0] * vec.values[0] + vec.values[1] * vec.values[1]);
  }
  public static squaredMagnitude(vec: Vector2D):number {
    return vec.values[0] * vec.values[0] + vec.values[1] * vec.values[1];
  }
  public static div(vec: Vector2D, val: number) {
    return Vector2D.mult(vec, 1 / val);
  }
  public dist(other: Vector2D) {
    return Vector2D.dist(this, other);
  }

  public flip() {
    return Vector2D.flip(this);
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

  public squaredMagnitude() {
    return Vector2D.squaredMagnitude(this);
  }


  public normalize() {
    return Vector2D.normalize(this);
  }
  public limit(maxVal: number) {
    return Vector2D.limit(this, maxVal);
  }
}
