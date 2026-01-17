import type { ShaderDefs, Shadow_Pass_Shader } from "./common-shaders";
import type { ShapeDefs } from "./common-shapes";
import type { ComponentDefs } from "./common-components";
import { Mat4, Vector3, Vector4 } from "../tiny-graphics-math";
import {
  Component,
  GPUAddresses,
  Shader,
  Shadow_Map,
  Shape,
  Texture,
  UBOBlockLayout,
  UBOBuffer,
} from "../tiny-graphics";

interface LightDefaultData {
  direction_or_position: Vector4;
  color: Vector3;
  diffuse: number;
  specular: number;
  attenuation_factor: number;
  casts_shadow: boolean;
  shadow_map_width: number;
  shadow_map_height: number;
  shadow_map_shader: Shadow_Pass_Shader;
  shadow_map: Shadow_Map[] | null;
}

type MaterialData = {
  color?: Vector4;
  ambient?: number;
  diffuse?: Vector3;
  specular?: Vector3;
  smoothness?: number;
  [key: string]: UBOBuffer | undefined;
};
type MaterialSampler = {
  diffuse_texture?: Texture;
  normal_texture?: Texture;
  specular_texture?: Texture;
  [key: string]: Texture | undefined;
};

declare class Camera {
  position: Vector3;
  at: Vector3;
  up: Vector3;
  view: Mat4;
  ubo_layout: UBOBlockLayout;
  is_initialized: boolean;
  proj?: Mat4;

  constructor(
    eye?: Vector3,
    at?: Vector3,
    up?: Vector3,
    fov_y?: number,
    aspect?: number,
    near?: number,
    far?: number,
  );

  initialize(caller: Component): void;
}

declare class Light {
  direction_or_position: Vector4;
  color: Vector3;
  diffuse: number;
  specular: number;
  attenuation_factor: number;
  casts_shadow: boolean;
  shadow_map_width: number;
  shadow_map_height: number;
  shadow_map_shader: Shadow_Pass_Shader;
  shadow_map: Shadow_Map[];

  index: number;
  ubo_layout: UBOBlockLayout;
  light_space_matrix: [Mat4, Mat4, Mat4, Mat4, Mat4, Mat4];
  is_point_light: boolean;
  is_initialized: boolean;

  constructor(data: Partial<LightDefaultData>);

  static default_values(): LightDefaultData;
  initialize(caller: Component): void;
  activate(gl: WebGL2RenderingContext, shadow_map_index: number): void;
  deactivate(caller: Component, shadow_map_index: number): void;
  bind(context: WebGL2RenderingContext, gpu_addresses: GPUAddresses): void;
}

declare class Material {
  name: string;
  shader: Shader | undefined;
  data: MaterialData;
  samplers: MaterialSampler;
  is_initialized: boolean;
  ready: boolean;

  constructor(
    name?: string,
    shader?: Shader,
    data?: MaterialData,
    samplers?: MaterialSampler,
  );

  initialize(gl: WebGL2RenderingContext, ubo_layout: UBOBlockLayout): void;
  bind(binding_point: number): void;
}

declare class Material_From_File {
  arg_data: MaterialData;
  arg_samplers: MaterialSampler;
  ready: boolean;
  readonly directory: string;
  // no need to expose MTL
  private MTL: any[];

  constructor(
    name?: string,
    shader?: Shader,
    filename?: string,
    data?: MaterialData,
    samplers?: MaterialSampler,
  );

  load_file(filename: string): Promise<void>;
  parse_into_material(data: string): void;
}

declare class Entity {
  dirty: boolean;
  shape: Shape;
  global_transform: Mat4;
  transforms: Mat4[];
  material: Material;

  constructor(shape: Shape, transforms: Mat4[], material: Material);
}

declare class Renderer {
  entities: Entity[];
  lights: Light[];

  constructor();

  submit(object: Entity): void;
  shadow_map_pass(caller: WebGL2RenderingContext, lights: Light[]): void;
  flush(
    caller: Component,
    lights?: Light[],
    clear_entities?: boolean,
    alternative_shader?: Shader,
  ): void;
}

type Defs = ShaderDefs &
  ShapeDefs &
  ComponentDefs & {
    Camera: typeof Camera;
    Light: typeof Light;
    Material: typeof Material;
    Material_From_File: typeof Material_From_File;
    Entity: typeof Entity;
    Renderer: typeof Renderer;
  };

export const defs: Defs;
