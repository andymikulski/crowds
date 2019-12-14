declare var requestIdleCallback:any;


export type Vector2D = [number, number];

export type Vector = Vector2D;

export default class VecMath {

  public static toString(vec: Vector2D):string {
    return `Vector2D(${vec.join(', ')})`
  }

  public static flip(vec: Vector2D):Vector2D {
    return [-vec[0], -vec[1]];
  }

  public static mult(vec: Vector2D, val: Vector2D | number):Vector2D {
    if (typeof val === 'number') {
      return [vec[0] * val, vec[1] * val];
    }

    return [vec[0] * val[0], vec[1] * val[1]];
  }

  public static div(vec: Vector2D, val: Vector2D | number):Vector2D {
    if (typeof val === 'number') {
      return [vec[0] / val, vec[1] / val];
    }

    return [vec[0] / val[0], vec[1] / val[1]];
  }
  public static addMultiple(vec: Vector2D, ...vals: Vector2D[]):Vector2D {
    let calc:Vector2D = [vec[0], vec[1]];

    for (let i = 0; i < vals.length; i++) {
      calc[0] += vals[i][0];
      calc[1] += vals[i][1];
    }

    return calc;
  }

  public static add(vec: Vector2D, val: Vector2D | number):Vector2D {
    if (typeof val === 'number') {
      return [vec[0] + val, vec[1] + val];
    }
    return [vec[0] + val[0], vec[1] + val[1]];
  }
  public static sub(vec: Vector2D, val: Vector2D | number):Vector2D {
    if (typeof val === 'number') {
      return [vec[0] - val, vec[1] - val];
    }

    return [vec[0] - val[0], vec[1] - val[1]];
  }
  public static dist(vec: Vector2D, other: Vector2D):number {
    return Math.sqrt(((other[0] - vec[0]) * (other[0] - vec[0]))
      + ((other[1] - vec[1]) * (other[1] - vec[1])));
  }

  public static squaredDist(vec: Vector2D, other: Vector2D):number {
    return ((other[0] - vec[0]) * (other[0] - vec[0]))
      + ((other[1] - vec[1]) * (other[1] - vec[1]));
  }

  public static dot(vec: Vector2D, other: Vector2D):number {
    return (vec[0] * other[0]) + (vec[0] * vec[1]);
  }

  public static cross(vec: Vector2D, other: Vector2D):number {
    return (vec[0] * other[1]) - (vec[1] * other[0]);
  }

  public static normalize(vec: Vector2D):Vector2D {
    const mag = VecMath.magnitude(vec);
    return VecMath.mult(vec, mag === 0 ? 0 : 1 / mag);
  }
  public static limit(vec: Vector2D, maxVal: number):Vector2D {
    return VecMath.mult(VecMath.normalize(vec), maxVal);
  }
  public static magnitude(vec: Vector2D): number {
    return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
  }
  public static squaredMagnitude(vec: Vector2D):number {
    return vec[0] * vec[0] + vec[1] * vec[1];
  }
}
