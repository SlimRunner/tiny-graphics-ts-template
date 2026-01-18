export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
  length: TLength;
};

interface VectorArithmetic<VecT, N extends number> {
  equals(b: VecT): boolean;
  plus(b: VecT): Vector<N>;
  minus(b: VecT): Vector<N>;
  times(s: number): Vector<N>;
  times_pairwise(b: VecT): Vector<N>;
  scale_by(s: number): void;
  dot(b: VecT): number;
  randomized(s: number): Vector<N>;
  mix(b: VecT, s: number): Vector<N>;
  norm(): number;
  normalized(): Vector<N>;
  normalize(): Vector<N>;
}

interface VectorMutable<N extends number> {
  add_by(b: VectorLike<N>): Vector<N> | Vector3 | Vector4;
  subtract_by(b: VectorLike<N>): Vector<N> | Vector3 | Vector4;
  scale_pairwise_by(b: VectorLike<N>): Vector<N> | Vector3 | Vector4;
}

interface VectorCrossable {
  cross(b: VectorLike<3>): Vector3 | Vector<3>;
}

type VectorLikeProxy<VecT, N extends number> = Float32Array & {
  readonly length: N;
  [i: number]: number;
} & VectorArithmetic<VecT, N>;

declare class VectorLike<N extends number>
  extends Float32Array
  implements VectorLikeProxy<VectorLike<N>, N>
{
  declare readonly length: N;
  equals(b: VectorLike<N>): boolean;
  plus(b: VectorLike<N>): Vector<N>;
  minus(b: VectorLike<N>): Vector<N>;
  times(s: number): Vector<N>;
  times_pairwise(b: VectorLike<N>): Vector<N>;
  scale_by(s: number): void;
  dot(b: VectorLike<N>): number;
  randomized(s: number): Vector<N>;
  mix(b: VectorLike<N>, s: number): Vector<N>;
  norm(): number;
  normalized(): Vector<N>;
  normalize(): Vector<N>;

  to_string(): string;
}

declare class Vector<N extends number> extends VectorLike<N> {
  static create<M extends number>(...arr: Tuple<number, M>): VectorLike<M>;
  copy(): VectorLike<N>;
  static cast<M extends number>(...args: Tuple<number, M>[]): VectorLike<M>[];
  to3(): Vector3;
  to4(): Vector4;
}

type UnsafeVec3 = Vector3 & { __unsafe: true };

declare class Vector3
  extends VectorLike<3>
  implements VectorMutable<3>, VectorCrossable
{
  static create(...arr: Tuple<number, 3>): Vector3;
  copy(): Vector3;
  static cast(...args: Tuple<number, 3>[]): VectorLike<3>[];

  add_by(b: VectorLike<3>): Vector3;
  subtract_by(b: VectorLike<3>): Vector3;
  scale_pairwise_by(b: VectorLike<3>): Vector3;
  cross(b: VectorLike<3>): Vector3;

  static shared_memory: UnsafeVec3;
  static unsafe(x: number, y: number, z: number): UnsafeVec3;

  to4(): Vector4;
}

type UnsafeVec4 = Vector4 & { __unsafe: true };

declare class Vector4 extends VectorLike<4> implements VectorMutable<4> {
  static create(...arr: Tuple<number, 4>): VectorLike<4>;
  copy(): VectorLike<4>;
  static cast(...args: Tuple<number, 4>[]): VectorLike<4>[];

  add_by(b: VectorLike<4>): Vector4;
  subtract_by(b: VectorLike<4>): Vector4;
  scale_pairwise_by(b: VectorLike<4>): Vector4;

  static shared_memory: UnsafeVec4;
  static unsafe(x: number, y: number, z: number, w: number): UnsafeVec4;

  to3(): Vector3;
}

type MatrixLike<R extends number, C extends number> = Array<Array<number>> & {
  readonly rows: R;
  readonly cols: C;
};

declare class Matrix<R extends number, C extends number>
  extends Array<Array<number>>
  implements MatrixLike<R, C>
{
  declare readonly rows: R;
  declare readonly cols: C;

  constructor(args: Tuple<Tuple<number, C>, R> | Matrix<R, C>);
  set(M: MatrixLike<R, C>): void;
  set_identity(n: R, m: C): Matrix<R, C>;
  sub_block<R2 extends number, C2 extends number>(
    start: [number, number],
    end: [number, number]
  ): Matrix<R2, C2>;
  copy(): Matrix<R, C>;
  equals(b: MatrixLike<R, C>): Matrix<R, C>;
  plus(b: MatrixLike<R, C>): Matrix<R, C>;
  minus(b: MatrixLike<R, C>): Matrix<R, C>;
  transposed(): Matrix<C, R>;
  times(b: number, pre_alloc?: MatrixLike<R, C>): Matrix<R, C>;
  times(b: MatrixLike<C, R>, pre_alloc?: MatrixLike<R, R>): Matrix<R, R>;
  times<R2 extends number, C2 extends number>(
    b: MatrixLike<R2, C2>,
    pre_alloc?: MatrixLike<R, C2>
  ): Matrix<R, C2>;
  pre_multiply(b: number): Matrix<R, C>;
  pre_multiply(b: MatrixLike<C, R>): Matrix<C, C>;
  pre_multiply<R2 extends number, C2 extends number>(
    b: MatrixLike<R2, C2>
  ): Matrix<R2, C>;
  post_multiply(b: number): Matrix<R, C>;
  post_multiply(b: MatrixLike<C, R>): Matrix<R, R>;
  post_multiply<R2 extends number, C2 extends number>(
    b: MatrixLike<R2, C2>
  ): Matrix<R, C2>;
  static flatten_2D_to_1D<
    R2 extends number,
    C2 extends number,
    F extends number
  >(M: MatrixLike<R2, C2>): Tuple<ArrayBuffer, F>;
  to_string(): string;
}

declare class Mat4 extends Matrix<4, 4> {
  load_identity(target: never): Mat4;
  static identity(): Mat4;
  static rotate_vec3(
    target: VectorLike<3>,
    angle: number,
    x: number,
    y: number,
    z: number
  ): void;
  static rotation(angle: number, x: number, y: number, z: number): Mat4;
  static scale(x: number, y: number, z: number): Mat4;
  static translation(x: number, y: number, z: number): Mat4;
  static look_at(
    eye: VectorLike<3>,
    at: VectorLike<3>,
    up: VectorLike<3>
  ): Mat4;
  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Mat4;
  static perspective(
    fov_y: number,
    aspect: number,
    near: number,
    far: number
  ): Mat4;
  static inverse(m: MatrixLike<4, 4>): Mat4;
}

type MathTiny = {
  Vector: typeof Vector;
  Vector3: typeof Vector3;
  Vector4: typeof Vector4;
  Matrix: typeof Matrix;
  Mat4: typeof Mat4;

  // aliases / factories
  vec: typeof Vector.create;
  vec3: typeof Vector3.create;
  vec4: typeof Vector4.create;
  unsafe3: typeof Vector3.unsafe;
  unsafe4: typeof Vector4.unsafe;
  color: typeof Vector4.create;
};

export declare const math: MathTiny;
