export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
  length: TLength;
};

export namespace math {
  export class Vector<N extends Number> extends Float32Array {
    static create<M extends number>(...arr: Tuple<number, M>): Vector<M>;
    static cast<M extends number>(...args: Tuple<number, M>[]): Vector<M>[];
    copy(): Vector<N>;

    equals(b: Vector<N> | Vector3 | Vector4): boolean;
    plus(b: Vector<N> | Vector3 | Vector4): Vector<N>;
    minus(b: Vector<N> | Vector3 | Vector4): Vector<N>;
    times_pairwise(b: Vector<N> | Vector3 | Vector4): Vector<N>;
    times(b: number): Vector<N>;
    scale_by(b: number): void;
    randomized(b: number): void;
    mix(b: Vector<N> | Vector3 | Vector4, s: number): Vector<N>;

    normalize(): void;

    norm(): number;
    normalized(): Vector<N>;
    dot(b: Vector<N> | Vector3 | Vector4): number;
    cross(b: Vector<N> | Vector3): Vector<3>;

    to3(): Vector3;
    to4(): Vector4;

    to_string(): string;
  }

  export class Vector3 extends Float32Array {
    static create(...arr: Tuple<number, 3>): Vector3;
    static cast(...args: Tuple<number, 3>[]): Vector3[];
    copy(): Vector3;

    equals(b: Vector<3> | Vector3): boolean;
    plus(b: Vector<3> | Vector3): Vector3;
    minus(b: Vector<3> | Vector3): Vector3;
    times_pairwise(b: Vector<3> | Vector3): Vector3;
    times(b: number): Vector3;
    randomized(s: number): Vector3;
    mix(b: Vector<3> | Vector3, s: number): Vector3;

    add_by(b: Vector<3> | Vector3): void;
    subtract_by(b: Vector<3> | Vector3): void;
    scale_by(s: number): void;
    scale_pairwise_by(b: Vector<3> | Vector3): void;
    normalize(): void;

    norm(): number;
    normalized(): Vector3;
    dot(b: Vector<3> | Vector3): number;
    cross(b: Vector<3> | Vector3): Vector3;

    static shared_memory: UnsafeVec3;
    static unsafe(x: number, y: number, z: number): UnsafeVec3;

    to4(is_a_point: 0 | 1): Vector4;
    to_string(): string;
  }

  type UnsafeVec3 = Vector3 & { __unsafe: true };

  export class Vector4 extends Float32Array {
    static create(...arr: Tuple<number, 4>): Vector4;
    static cast(...args: Tuple<number, 4>[]): Vector4[];
    copy(): Vector4;

    equals(b: Vector<4> | Vector4): boolean;
    plus(b: Vector<4> | Vector4): Vector4;
    minus(b: Vector<4> | Vector4): Vector4;
    times_pairwise(b: Vector<4> | Vector4): Vector4;
    times(b: number): Vector4;
    randomized(s: number): Vector4;
    mix(b: Vector<4> | Vector4, s: number): Vector4;

    add_by(b: Vector<4> | Vector4): void;
    subtract_by(b: Vector<4> | Vector4): void;
    scale_by(s: number): void;
    scale_pairwise_by(b: Vector<4> | Vector4): void;
    normalize(): void;

    norm(): number;
    normalized(): Vector4;
    dot(b: Vector<4> | Vector4): number;

    static shared_memory: UnsafeVec4;
    static unsafe(x: number, y: number, z: number, w: number): UnsafeVec4;

    to3(): Vector3;
    to_string(): string;
  }

  type UnsafeVec4 = Vector4 & { __unsafe: true };

  export type MatrixLike<R extends number, C extends number> = Array<
    Array<number>
  > & {
    readonly rows: R;
    readonly cols: C;
  };

  export class Matrix<R extends number, C extends number>
    extends Array<Array<number>>
    implements MatrixLike<R, C>
  {
    declare readonly rows: R;
    declare readonly cols: C;

    /**
     * Constructs a R*C matrix. Type system prevents bad matrix
     * operations.
     *
     * NOTE: **this class has partial support for non-square matrices.**
     * Particularly transposition and multiplication fail silently for
     * non-square matrices.
     *
     * @param args rows of matrix
     */
    constructor(...args: Tuple<Tuple<number, C>, R>);
    /**
     * set matrix by provided values
     * @param M source matrix or array of arrays
     */
    set(M: MatrixLike<R, C>): void;
    /**
     * (mutable) sets matrix to an identity matrix of provided size.
     *
     * NOTE: this is a bad design for a function, so the type system
     * prevents you from using any number other than the size of this
     * instance. **The size of a matrix should not be mutable.**
     *
     * @param n row count
     * @param m column count
     */
    set_identity(n: R, m: C): void;
    /**
     * (mutable) returns a sub-matrix with the provided boundaries.
     *
     * NOTE: the type system cannot compute the new size statically so
     * you have to provide it yourself.
     *
     * @param start 2-tuple of first row and column of sub-matrix
     * @param end 2-tuple of last row and column of sub-matrix
     */
    sub_block<R2 extends number, C2 extends number>(
      start: [number, number],
      end: [number, number],
    ): Matrix<R2, C2>;
    /**
     * returns a deep copy of this matrix
     */
    copy(): Matrix<R, C>;
    /**
     * returns true if there is member-wise matrix equality
     * @param b rhs of operation
     */
    equals(b: MatrixLike<R, C>): boolean;
    /**
     * returns the result of `this + rhs`
     * @param b rhs of operation
     */
    plus(b: MatrixLike<R, C>): Matrix<R, C>;
    /**
     * returns the result of `this - rhs`
     * @param b rhs of operation
     */
    minus(b: MatrixLike<R, C>): Matrix<R, C>;
    /**
     * returns the transposition of this matrix
     */
    transposed(): Matrix<C, R>;
    /**
     * returns the result of `this * scalar`
     * @param s rhs of operation
     * @param pre_alloc optional result of this multiplication (?!)
     */
    times(s: number, pre_alloc?: MatrixLike<R, C>): Matrix<R, C>;
    /**
     * returns the result of `this * vector`
     * @param v rhs of operation
     * @param pre_alloc optional result of this multiplication (?!)
     */
    times(v: Vector4, pre_alloc?: MatrixLike<R, 4>): Matrix<R, 1>;
    /**
     * returns the result of `this * matrix`
     * @param b rhs of operation
     * @param pre_alloc optional result of this multiplication (?!)
     */
    times<C2 extends number>(
      b: MatrixLike<C, C2>,
      pre_alloc?: MatrixLike<R, C2>,
    ): Matrix<R, C2>;
    /**
     * (mutable) returns the result of `matrix * this`. Allows chaining
     * @param b rhs of operation
     */
    pre_multiply<R2 extends number>(b: MatrixLike<R2, R>): Matrix<R2, C>;
    /**
     * (mutable) returns the result of `this * scalar`. Allows chaining
     * @param s rhs of operation
     */
    post_multiply(s: number): Matrix<R, C>;
    /**
     * (mutable) returns the result of `this * vector`. Allows chaining
     * @param v rhs of operation
     */
    post_multiply<C2 extends number>(v: Vector4): Matrix<R, 1>;
    /**
     * (mutable) returns the result of `this * matrix`. Allows chaining
     * @param b rhs of operation
     */
    post_multiply<C2 extends number>(b: MatrixLike<C, C2>): Matrix<R, C2>;
    /**
     * returns a flattened Float32Array
     * @param M Matrix object
     */
    static flatten_2D_to_1D<R2 extends number, C2 extends number>(
      M: MatrixLike<R2, C2>,
    ): Float32Array;
    /**
     * returns printable format of this matrix
     */
    to_string(): string;
  }

  export class Mat4 extends Matrix<4, 4> {
    /**
     * returns an identity matrix
     */
    static identity(): Mat4;
    /**
     * returns a rotation matrix transform defined around a direction
     * vector
     * @param angle angle of rotation along axis
     * @param x x-component of rotation axis
     * @param y y-component of rotation axis
     * @param z y-component of rotation axis
     */
    static rotation(angle: number, x: number, y: number, z: number): Mat4;
    /**
     * returns a scaling matrix transform
     * @param x x-axis scaling amount
     * @param y y-axis scaling amount
     * @param z z-axis scaling amount
     */
    static scale(x: number, y: number, z: number): Mat4;
    /**
     * returns a translation matrix transform
     * @param x x-axis shift amount
     * @param y y-axis shift amount
     * @param z z-axis shift amount
     */
    static translation(x: number, y: number, z: number): Mat4;
    /**
     * returns a rotation matrix that adjust object to look at a
     * specific location with a given up direction. Useful to define
     * cameras or flying objects
     * @param eye desired location of the object
     * @param at location at which the object "points at"
     * @param up designed "up" axis (tiny-graphics is y-up)
     */
    static look_at(
      eye: Vector3 | Vector<3>,
      at: Vector3 | Vector<3>,
      up: Vector3 | Vector<3>,
    ): Mat4;
    /**
     * returns an orthographic projection matrix
     * @param left left boundary of projection
     * @param right right boundary of projection
     * @param bottom bottom boundary of projection
     * @param top top boundary of projection
     * @param near clip distance of nearest object
     * @param far clip distance of farthest object
     */
    static orthographic(
      left: number,
      right: number,
      bottom: number,
      top: number,
      near: number,
      far: number,
    ): Mat4;
    /**
     * returns a conic projection matrix
     * @param fov_y angle of aperture of projection in radians
     * @param aspect aspect ration relative to height
     * @param near clip distance of nearest object
     * @param far clip distance of farthest object
     */
    static perspective(
      fov_y: number,
      aspect: number,
      near: number,
      far: number,
    ): Mat4;
    /**
     * returns the inverse of the given matrix
     * @param m input matrix to invert
     */
    static inverse(m: MatrixLike<4, 4>): Mat4;
  }

  export const vec: typeof Vector.create;
  export const vec3: typeof Vector3.create;
  export const vec4: typeof Vector4.create;
  export const unsafe3: typeof Vector3.unsafe;
  export const unsafe4: typeof Vector4.unsafe;
  export const color: typeof Vector4.create;
}
