import { Mat4, Vector3 } from "../tiny-graphics-math";
import type {
  Component,
  Shader,
  Shape,
  ShapeVertex,
  Uniforms,
} from "../tiny-graphics.d.ts";
import { Material } from "./common";

type TextureRange = [[number, number], [number, number]];

// TODO: a lot of the original functions call the base constructor like this
// - `super ("position", "normal", "texture_coord");`
//
// but shape has no such parameters. Probably a bad refactor.

declare class Triangle extends Shape {
  constructor();
}

declare class Square extends Shape {
  constructor();
}

declare class Tetrahedron extends Shape {
  constructor(using_flat_shading: boolean);
}

declare class Windmill extends Shape {
  constructor(num_blades: number);
}

declare class Cube extends Shape {
  constructor();
}

declare class Subdivision_Sphere extends Shape {
  constructor(max_subdivisions: number);
  subdivide_triangle(a: number, b: number, c: number, count: number): void;
}

declare class Grid_Patch extends Shape {
  constructor(
    rows: number,
    columns: number,
    next_row_function: (t: number, prev_point: number) => number,
    next_column_function: (u: number, prev_point: number, v: number) => number,
    texture_coord_range: TextureRange,
  );
  static sample_array(array: Vector3[], ratio: number): Vector3;
}

declare class Surface_Of_Revolution extends Grid_Patch {
  constructor(
    rows: number,
    columns: number,
    points: Vector3[],
    texture_coord_range: TextureRange,
    total_curvature_angle?: number,
  );
  static sample_array(array: any[], ratio: number): any;
}

declare class Regular_2D_Polygon extends Surface_Of_Revolution {
  constructor(rows: number, columns: number);
}

declare class Cylindrical_Tube extends Surface_Of_Revolution {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Cone_Tip extends Surface_Of_Revolution {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Torus extends Shape {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Grid_Sphere extends Shape {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Closed_Cone extends Shape {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Rounded_Closed_Cone extends Surface_Of_Revolution {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Capped_Cylinder extends Shape {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Rounded_Capped_Cylinder extends Surface_Of_Revolution {
  constructor(rows: number, columns: number, texture_range: TextureRange);
}

declare class Axis_Arrows extends Shape {
  constructor();

  drawOneAxis(transform: Mat4, tex: TextureRange): void;
}

declare class Instanced_Shape extends Shape {
  single_triangle: ShapeVertex[];

  constructor();
}

declare class Instanced_Square extends Shape {
  // wtf? a copy-paste mistake
  single_triangle: ShapeVertex[];

  constructor();
}

declare class Instanced_Square_Index extends Shape {
  // wtf? a copy-paste mistake
  single_triangle: ShapeVertex[];

  constructor();
}

declare class Instanced_Cube_Index extends Shape {
  single_cube: ShapeVertex[];

  constructor();
}

declare class Minimal_Shape extends Shape {
  constructor();
}

declare class Minimaler_Shape extends Shape {
  constructor();
}

declare class Shape_From_File extends Shape {
  ready: boolean;
  uses_3d_texture: boolean;

  constructor(filename: string, uses_3d_texture?: boolean);

  load_file(filename: string): Promise<void>;
  parse_into_mesh(data: string): void;
  draw(
    caller: Component, // renamed from base
    uniforms: Uniforms,
    model_transform: Mat4,
    material: Material,
    type?: keyof WebGL2RenderingContext,
    instances?: GLsizei,
  ): void;
}

type ShapeDefs = {
  Triangle: typeof Triangle;
  Square: typeof Square;
  Tetrahedron: typeof Tetrahedron;
  Windmill: typeof Windmill;
  Cube: typeof Cube;
  Subdivision_Sphere: typeof Subdivision_Sphere;
  Grid_Patch: typeof Grid_Patch;
  Surface_Of_Revolution: typeof Surface_Of_Revolution;
  Regular_2D_Polygon: typeof Regular_2D_Polygon;
  Cylindrical_Tube: typeof Cylindrical_Tube;
  Cone_Tip: typeof Cone_Tip;
  Torus: typeof Torus;
  Grid_Sphere: typeof Grid_Sphere;
  Closed_Cone: typeof Closed_Cone;
  Rounded_Closed_Cone: typeof Rounded_Closed_Cone;
  Capped_Cylinder: typeof Capped_Cylinder;
  Rounded_Capped_Cylinder: typeof Rounded_Capped_Cylinder;
  Axis_Arrows: typeof Axis_Arrows;
  Instanced_Shape: typeof Instanced_Shape;
  Instanced_Square: typeof Instanced_Square;
  Instanced_Square_Index: typeof Instanced_Square_Index;
  Instanced_Cube_Index: typeof Instanced_Cube_Index;
  Minimal_Shape: typeof Minimal_Shape;
  Minimaler_Shape: typeof Minimaler_Shape;
  Shape_From_File: typeof Shape_From_File;
};

export const def: ShapeDefs;
