import type { defs as ShaderNamespace } from "./common-shaders";
import type { defs as ShapeNamespace } from "./common-shapes";
import type { defs as CompNamespace } from "./common-components";
import { math } from "../tiny-graphics-math";
import {
  GPUAddresses,
  tiny as TinyNamespace,
  UBOBlockLayout,
  UBOBuffer,
} from "../tiny-graphics";

interface LightDefaultData {
  direction_or_position: math.Vector4;
  color: math.Vector3;
  diffuse: number;
  specular: number;
  attenuation_factor: number;
  casts_shadow: boolean;
  shadow_map_width: number;
  shadow_map_height: number;
  shadow_map_shader: ShaderNamespace.Shadow_Pass_Shader;
  shadow_map: TinyNamespace.Shadow_Map[] | null;
}

type MaterialData = {
  color?: math.Vector4;
  ambient?: number;
  diffuse?: math.Vector3;
  specular?: math.Vector3;
  smoothness?: number;
  [key: string]: UBOBuffer | undefined;
};
type MaterialSampler = {
  diffuse_texture?: TinyNamespace.Texture;
  normal_texture?: TinyNamespace.Texture;
  specular_texture?: TinyNamespace.Texture;
  [key: string]: TinyNamespace.Texture | undefined;
};

export namespace defs {
  // current common is empty

  export import Basic_Shader = ShaderNamespace.Basic_Shader;
  export import Basicer_Shader = ShaderNamespace.Basicer_Shader;
  export import Fake_Bump_Map = ShaderNamespace.Fake_Bump_Map;
  export import Instanced_Shader = ShaderNamespace.Instanced_Shader;
  export import Phong_Shader = ShaderNamespace.Phong_Shader;
  export import Shadow_Instanced_Shader = ShaderNamespace.Shadow_Instanced_Shader;
  export import Shadow_Pass_Shader = ShaderNamespace.Shadow_Pass_Shader;
  export import Shadow_Textured_Instanced_Shader = ShaderNamespace.Shadow_Textured_Instanced_Shader;
  export import Textured_Instanced_Shader = ShaderNamespace.Textured_Instanced_Shader;
  export import Textured_Phong = ShaderNamespace.Textured_Phong;

  export import Triangle = ShapeNamespace.Triangle;
  export import Square = ShapeNamespace.Square;
  export import Tetrahedron = ShapeNamespace.Tetrahedron;
  export import Windmill = ShapeNamespace.Windmill;
  export import Cube = ShapeNamespace.Cube;
  export import Subdivision_Sphere = ShapeNamespace.Subdivision_Sphere;
  export import Grid_Patch = ShapeNamespace.Grid_Patch;
  export import Surface_Of_Revolution = ShapeNamespace.Surface_Of_Revolution;
  export import Regular_2D_Polygon = ShapeNamespace.Regular_2D_Polygon;
  export import Cylindrical_Tube = ShapeNamespace.Cylindrical_Tube;
  export import Cone_Tip = ShapeNamespace.Cone_Tip;
  export import Torus = ShapeNamespace.Torus;
  export import Grid_Sphere = ShapeNamespace.Grid_Sphere;
  export import Closed_Cone = ShapeNamespace.Closed_Cone;
  export import Rounded_Closed_Cone = ShapeNamespace.Rounded_Closed_Cone;
  export import Capped_Cylinder = ShapeNamespace.Capped_Cylinder;
  export import Rounded_Capped_Cylinder = ShapeNamespace.Rounded_Capped_Cylinder;
  export import Axis_Arrows = ShapeNamespace.Axis_Arrows;
  export import Instanced_Shape = ShapeNamespace.Instanced_Shape;
  export import Instanced_Square = ShapeNamespace.Instanced_Square;
  export import Instanced_Square_Index = ShapeNamespace.Instanced_Square_Index;
  export import Instanced_Cube_Index = ShapeNamespace.Instanced_Cube_Index;
  export import Minimal_Shape = ShapeNamespace.Minimal_Shape;
  export import Minimaler_Shape = ShapeNamespace.Minimaler_Shape;
  export import Shape_From_File = ShapeNamespace.Shape_From_File;

  export import Movement_Controls = CompNamespace.Movement_Controls;
}
