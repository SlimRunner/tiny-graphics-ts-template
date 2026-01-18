import { math } from "../tiny-graphics-math";
import type { ShapeVertex, tiny, Uniforms } from "../tiny-graphics";
import { defs } from "./common";

type TextureRange = [[number, number], [number, number]];

// TODO: a lot of the original functions call the base constructor like this
// - `super ("position", "normal", "texture_coord");`
//
// but shape has no such parameters. Probably a bad refactor.

export namespace defs {
  export class Triangle extends tiny.Shape {
    constructor();
  }

  export class Square extends tiny.Shape {
    constructor();
  }

  export class Tetrahedron extends tiny.Shape {
    constructor(using_flat_shading: boolean);
  }

  export class Windmill extends tiny.Shape {
    constructor(num_blades: number);
  }

  export class Cube extends tiny.Shape {
    constructor();
  }

  export class Subdivision_Sphere extends tiny.Shape {
    constructor(max_subdivisions: number);
    subdivide_triangle(a: number, b: number, c: number, count: number): void;
  }

  export class Grid_Patch extends tiny.Shape {
    constructor(
      rows: number,
      columns: number,
      next_row_function: (t: number, prev_point: number) => number,
      next_column_function: (
        u: number,
        prev_point: number,
        v: number,
      ) => number,
      texture_coord_range: TextureRange,
    );
    static sample_array(array: math.Vector3[], ratio: number): math.Vector3;
  }

  export class Surface_Of_Revolution extends Grid_Patch {
    constructor(
      rows: number,
      columns: number,
      points: math.Vector3[],
      texture_coord_range: TextureRange,
      total_curvature_angle?: number,
    );
    static sample_array(array: any[], ratio: number): any;
  }

  export class Regular_2D_Polygon extends Surface_Of_Revolution {
    constructor(rows: number, columns: number);
  }

  export class Cylindrical_Tube extends Surface_Of_Revolution {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Cone_Tip extends Surface_Of_Revolution {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Torus extends tiny.Shape {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Grid_Sphere extends tiny.Shape {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Closed_Cone extends tiny.Shape {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Rounded_Closed_Cone extends Surface_Of_Revolution {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Capped_Cylinder extends tiny.Shape {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Rounded_Capped_Cylinder extends Surface_Of_Revolution {
    constructor(rows: number, columns: number, texture_range: TextureRange);
  }

  export class Axis_Arrows extends tiny.Shape {
    constructor();

    drawOneAxis(transform: math.Mat4, tex: TextureRange): void;
  }

  export class Instanced_Shape extends tiny.Shape {
    single_triangle: ShapeVertex[];

    constructor();
  }

  export class Instanced_Square extends tiny.Shape {
    // wtf? a copy-paste mistake
    single_triangle: ShapeVertex[];

    constructor();
  }

  export class Instanced_Square_Index extends tiny.Shape {
    // wtf? a copy-paste mistake
    single_triangle: ShapeVertex[];

    constructor();
  }

  export class Instanced_Cube_Index extends tiny.Shape {
    single_cube: ShapeVertex[];

    constructor();
  }

  export class Minimal_Shape extends tiny.Shape {
    constructor();
  }

  export class Minimaler_Shape extends tiny.Shape {
    constructor();
  }

  export class Shape_From_File extends tiny.Shape {
    ready: boolean;
    uses_3d_texture: boolean;

    constructor(filename: string, uses_3d_texture?: boolean);

    load_file(filename: string): Promise<void>;
    parse_into_mesh(data: string): void;
    draw(
      caller: tiny.Component, // renamed from base
      uniforms: Uniforms,
      model_transform: math.Mat4,
      material: defs.Material,
      type?: keyof WebGL2RenderingContext,
      instances?: GLsizei,
    ): void;
  }
}
