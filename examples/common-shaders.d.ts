import {
  GPUAddresses,
  tiny,
  UBOBinding,
  UBOBlockLayout,
  Uniforms,
} from "../tiny-graphics";
import { math } from "../tiny-graphics-math";
import { Material } from "./common";

interface LightSource {
  position: math.Vector4;
  color: math.Vector4;
  attenuation: number;
}

type FlatPhongMaterial = {
  color: math.Vector4;
  ambient: number;
  diffusivity: number;
  specularity: number;
  smoothness: number;
  texture?: tiny.Texture;
};

export namespace defs {
  export class Basicer_Shader extends tiny.Shader {}

  export class Basic_Shader extends tiny.Shader {}

  export class Instanced_Shader extends tiny.Shader {
    num_lights: number;
    ubo_binding: UBOBinding;
    ubo_layout: UBOBlockLayout;

    constructor(num_lights?: number);

    update_GPU(
      context: WebGL2RenderingContext,
      gpu_addresses: GPUAddresses,
      uniforms: // NOTE: is this too much?
        | Uniforms
        | {
            light_space_matrix?: math.Mat4;
            lights?: LightSource[];
          },
      model_transform: math.Mat4,
      material: Material,
    ): void;

    static default_values(): {
      color: math.Vector4;
      ambient: number;
      diffuse: math.Vector3;
      specular: math.Vector3;
      smoothness: number;
    };
  }

  export class Textured_Instanced_Shader extends Instanced_Shader {}

  export class Shadow_Pass_Shader extends tiny.Shader {}

  export class Shadow_Instanced_Shader extends Instanced_Shader {}

  export class Shadow_Textured_Instanced_Shader extends Instanced_Shader {}

  export class Phong_Shader extends tiny.Shader {
    num_lights: number;
    ubo_binding: UBOBinding;
    ubo_layout: UBOBlockLayout;

    constructor(num_lights?: number);

    static light_source(
      position: math.Vector4,
      color: math.Vector4,
      size: number,
    ): LightSource;
    send_material(
      gl: WebGL2RenderingContext,
      gpu: GPUAddresses,
      material: Material | FlatPhongMaterial,
    ): void;
    send_uniforms(
      gl: WebGL2RenderingContext,
      gpu: GPUAddresses,
      uniforms: Uniforms,
      model_transform: math.Mat4,
    ): void;
  }

  export class Textured_Phong extends Phong_Shader {
    update_GPU(
      context: WebGL2RenderingContext,
      gpu_addresses: GPUAddresses,
      uniforms: Uniforms,
      model_transform: math.Mat4,
      material: Material | FlatPhongMaterial,
    ): void;
  }

  export class Fake_Bump_Map extends Textured_Phong {}
}
