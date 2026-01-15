import {
  GPUAdresses,
  Shader,
  Texture,
  UBOBinding,
  UBOBlockLayout,
  Uniforms,
} from "../tiny-graphics";
import { Mat4, Vector3, Vector4 } from "../tiny-graphics-math";
import { Material } from "./common";

interface LightSource {
  position: Vector4;
  color: Vector4;
  attenuation: number;
}

type FlatPhongMaterial = {
  color: Vector4;
  ambient: number;
  diffusivity: number;
  specularity: number;
  smoothness: number;
  texture?: Texture;
};

declare class Basicer_Shader extends Shader {}

declare class Basic_Shader extends Shader {}

declare class Instanced_Shader extends Shader {
  num_lights: number;
  ubo_binding: UBOBinding;
  ubo_layout: UBOBlockLayout;

  constructor(num_lights?: number);

  update_GPU(
    context: WebGL2RenderingContext,
    gpu_addresses: GPUAdresses,
    uniforms: // NOTE: is this too much?
      | Uniforms
      | {
          light_space_matrix?: Mat4;
          lights?: LightSource[];
        },
    model_transform: Mat4,
    material: Material,
  ): void;

  static default_values(): {
    color: Vector4;
    ambient: number;
    diffuse: Vector3;
    specular: Vector3;
    smoothness: number;
  };
}

declare class Textured_Instanced_Shader extends Instanced_Shader {}

declare class Shadow_Pass_Shader extends Shader {}

declare class Shadow_Instanced_Shader extends Instanced_Shader {}

declare class Shadow_Textured_Instanced_Shader extends Instanced_Shader {}

declare class Phong_Shader extends Shader {
  num_lights: number;
  ubo_binding: UBOBinding;
  ubo_layout: UBOBlockLayout;

  constructor(num_lights?: number);

  static light_source(
    position: Vector4,
    color: Vector4,
    size: number,
  ): LightSource;
  send_material(
    gl: WebGL2RenderingContext,
    gpu: GPUAdresses,
    material: Material | FlatPhongMaterial,
  ): void;
  send_uniforms(
    gl: WebGL2RenderingContext,
    gpu: GPUAdresses,
    uniforms: Uniforms,
    model_transform: Mat4,
  ): void;
}

declare class Textured_Phong extends Phong_Shader {
  update_GPU(
    context: WebGL2RenderingContext,
    gpu_addresses: GPUAdresses,
    uniforms: Uniforms,
    model_transform: Mat4,
    material: Material | FlatPhongMaterial,
  ): void;
}

declare class Fake_Bump_Map extends Textured_Phong {}

export const def: {
  Basicer_Shader: typeof Basicer_Shader;
  Basic_Shader: typeof Basic_Shader;
  Instanced_Shader: typeof Instanced_Shader;
  Textured_Instanced_Shader: typeof Textured_Instanced_Shader;
  Shadow_Pass_Shader: typeof Shadow_Pass_Shader;
  Shadow_Instanced_Shader: typeof Shadow_Instanced_Shader;
  Shadow_Textured_Instanced_Shader: typeof Shadow_Textured_Instanced_Shader;
  Phong_Shader: typeof Phong_Shader;
  Textured_Phong: typeof Textured_Phong;
  Fake_Bump_Map: typeof Fake_Bump_Map;
};
