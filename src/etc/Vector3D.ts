// export default class Vector3D {
//   private static pool: Vector3D[] = [];
//   private static _next:Vector3D;
//   public static get(initial?: number[] | Vector3D):Vector3D {
//     if (Vector3D.pool.length) {
//       Vector3D._next = Vector3D.pool.pop();
//     } else {
//       Vector3D._next = new Vector3D();
//     }
//     Vector3D._next.length = 0;
//     Vector3D._next.push.apply(Vector3D._next);
//     return Vector3D._next;
//   }

//   public values: number[] = [0, 0, 0];
//   private constructor(initial?: number[] | Vector3D) {
//     if (!initial) {
//       this = [0, 0, 0];
//     } else if (Array.isArray(initial)) {
//       this = [].push.apply(initial);
//     } else {
//       this = [].push.apply(initial);
//     }
//   }


//   public static toString(vec: Vector3D) {
//     return `Vector3D(${vec.join(', ')})`
//   }

//   public toString() {
//     return Vector3D.toString(this);
//   }


//   public static mult(vec: Vector3D, val: Vector3D | number) {
//     if (typeof val === 'number') {
//       vec[0] *= val;
//       vec[1] *= val;
//       vec[2] *= val;
//     }
//     else {
//       vec[0] *= val[0];
//       vec[1] *= val[1];
//       vec[2] *= val[2];
//     }

//     return vec;
//   }

//   public static addMultiple(vec: Vector3D, ...vals: Vector3D[]) {
//     for (let i = 0; i < vals.length; i++) {
//       vec[0] += vals[i][0];
//       vec[1] += vals[i][1];
//       vec[2] += vals[i][2];
//     }

//     return vec;
//   }

//   public static add(vec: Vector3D, val: Vector3D | number) {
//     if (typeof val === 'number') {
//       vec = vec.map(x => x + val);
//     }
//     else {
//       vec[0] += val[0];
//       vec[1] += val[1];
//       vec[2] += val[2];
//     }
//     return vec;
//   }
//   public static sub(vec: Vector3D, val: Vector3D | number) {
//     if (typeof val === 'number') {
//       vec = vec.map(x => x - val);
//     }
//     else {
//       vec[0] -= val[0];
//       vec[1] -= val[1];
//       vec[2] -= val[2];
//     }
//     return vec;
//   }
//   public static dist(vec: Vector3D, other: Vector3D) {
//     return Math.sqrt(((other[0] - vec[0]) * (other[0] - vec[0]))
//       + ((other[1] - vec[1]) * (other[1] - vec[1]))
//       + ((other[2] - vec[2]) * (other[2] - vec[2])));
//   }

//   public static squaredDist(vec: Vector3D, other: Vector3D) {
//     return ((other[0] - vec[0]) * (other[0] - vec[0]))
//       + ((other[1] - vec[1]) * (other[1] - vec[1]))
//       + ((other[2] - vec[2]) * (other[2] - vec[2]));
//   }

//   public static normalize(vec: Vector3D) {
//     Vector3D.mult(vec, 1 / Vector3D.magnitude(vec));
//     return vec;
//   }
//   public static limit(vec: Vector3D, maxVal: number) {
//     Vector3D.normalize(vec);
//     Vector3D.mult(vec, maxVal);
//     return vec;
//   }
//   public static magnitude(vec: Vector3D): number {
//     return Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
//   }
//   public static div(vec: Vector3D, val: number) {
//     return Vector3D.mult(vec, 1 / val);
//   }
//   public dist(other: Vector3D) {
//     return Vector3D.dist(this, other);
//   }
//   public div(val: number) {
//     return Vector3D.mult(this, 1 / val);
//   }
//   public mult(val: Vector3D | number) {
//     return Vector3D.mult(this, val);
//   }
//   public add(val: Vector3D | number) {
//     return Vector3D.add(this, val);
//   }
//   public addMultiple(...vals: Vector3D[]) {
//     return Vector3D.addMultiple(this, ...vals);
//   }
//   public sub(val: Vector3D | number) {
//     return Vector3D.sub(this, val);
//   }
//   public magnitude() {
//     return Vector3D.magnitude(this);
//   }
//   public normalize() {
//     return Vector3D.normalize(this);
//   }
//   public limit(maxVal: number) {
//     return Vector3D.limit(this, maxVal);
//   }
// }
