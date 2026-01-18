import type {
  math as MathNamespace,
  math,
} from "./tiny-graphics-math";
import type {
  widgets as WidgetsNamespace,
  widgets,
} from "./tiny-graphics-gui";

import { Material } from "./examples/common";

interface DefaultUniforms {
  camera_inverse: math.Mat4;
  camera_transform: math.Mat4;
  projection_transform: math.Mat4;
  animate: boolean;
  animation_time: number;
  animation_delta_time: number;
}

interface Uniforms extends DefaultUniforms {
  [key: string]: any;
}

interface ComponentProps {
  uniforms: Uniforms;
  dont_tick?: boolean;
  [key: string]: any;
}

interface ShapeGPUInstance {
  VAO?: WebGLVertexArrayObject;
  index_buffer?: WebGLBuffer;
  [key: string]: any;
}

type GPUAddresses = Record<string, WebGLUniformLocation | null>;

interface ShaderGPUInstance {
  program?: WebGLProgram;
  gpu_addresses?: GPUAddresses;
  vertShdr?: WebGLShader;
  fragShdr?: WebGLShader;
  [key: string]: any;
}

interface TextureGPUInstance {
  texture_buffer_pointer: WebGLTexture | undefined;
  [key: string]: any;
}

interface ShadowMapGPUInstance {
  texture_buffer_pointer: WebGLTexture | undefined;
  fbo_pointer?: WebGLFramebuffer;
  [key: string]: any;
}

interface ComponentLayoutOptions {
  show_canvas?: boolean;
  make_controls?: boolean;
  make_code_nav?: boolean;
  make_editor?: boolean;
  [key: string]: any;
}

type Constructor<T> = abstract new (...args: any[]) => T;

interface ShapeVertex {
  position: math.Vector3;
  color?: math.Vector4;
  normal?: math.Vector3;
  texture_coord?: math.Vector<2>;
  [attribute: string]: number | math.VectorLike<any> | math.Matrix<any, any> | undefined;
}

type ShapeArrays = ShapeVertex & {
  normal: math.Vector4;
};

type VertexAttributeName = keyof ShapeVertex | (string & {});

interface LocalBuffer {
  attributes?: VertexAttributeName[];
  sizes?: number[];
  attribute_is_matrix?: boolean;
  offsets?: number[];
  stride?: number;
  divisor?: number;
  hint?: keyof WebGL2RenderingContext;
  vertices_length?: number;
  override?: boolean;
  dirty?: boolean;
  data?: Float32Array;
}

interface UBOBinding {
  shader_name: string;
  binding_point: number;
}

type UBOCacheSizeType =
  | "float"
  | "int"
  | "bool"
  | "math.Mat4"
  | "Mat3"
  | "vec2"
  | "vec3"
  | "vec4"
  | (string & {});

interface UBOLayoutItem {
  name: string;
  type: UBOCacheSizeType;
  length?: number;

  offset?: number;
  chunk_length?: number;
  data_length?: number;
}

interface UBOBlockLayout {
  data_layout: UBOLayoutItem[];
  num_instances: number;

  data_offset?: number;
  data_length?: number;
}

interface UBOItems {
  data_layout_offset: number;
  data_layout_length: number;
  offset: number;
  data_length: number;
  chunk_length: number;
}

type UBOBuffer = Float32Array | number[] | number;

// ==============================================================

export namespace tiny {
  export class Shape {
    vertices: ShapeVertex[];
    indices: number[];
    local_buffers: LocalBuffer[];
    attribute_counter: number;
    dirty: boolean;
    ready: boolean;
    gpu_instances: Map<WebGL2RenderingContext, ShapeGPUInstance>;
    num_vertices?: number[];
    arrays?: ShapeArrays[];

    constructor();

    fill_buffer(
      selection_of_attributes: readonly VertexAttributeName[],
      buffer_hint?: keyof WebGL2RenderingContext,
      divisor?: number,
    ): void;
    copy_onto_graphics_card(
      context: WebGL2RenderingContext,
      write_to_indices?: boolean,
    ): ShapeGPUInstance;
    execute_shaders(
      gl: WebGL2RenderingContext,
      gpu_instance: ShapeGPUInstance,
      type: keyof WebGL2RenderingContext,
      instances: GLsizei,
    ): void;
    draw(
      webgl_manager: Component,
      uniforms: Uniforms,
      model_transform: math.Mat4,
      material: Material,
      type?: keyof WebGL2RenderingContext,
      instances?: GLsizei,
    ): void;
    static insert_transformed_copy_into(
      recipient: Shape,
      args: any[], // TODO: improve when you type common.js ?
      points_transform?: math.Mat4,
    ): void;
    make_flat_shaded_version(): abstract new (...args: any[]) => this;
    duplicate_the_shared_vertices(): void;
    flat_shade(): void;
    normalize_positions(keep_aspect_ratios?: boolean): void;
  }

  export class Shader {
    gpu_instances: Map<WebGL2RenderingContext, ShaderGPUInstance>;

    copy_onto_graphics_card(context: WebGL2RenderingContext): ShaderGPUInstance;
    activate(
      context: WebGL2RenderingContext,
      uniforms: Uniforms,
      model_transform: math.Mat4,
      material: Material,
    ): void;
    init_UBO(
      gl: WebGL2RenderingContext,
      program: WebGLProgram,
      ubo_binding: UBOBinding,
    ): void;
    bind_UBO(
      gl: WebGL2RenderingContext,
      program: WebGLProgram,
      shader_name: string,
      binding_point: number,
    ): void;
    vertex_glsl_code(): string;
    fragment_glsl_code(): string;
    update_GPU(
      context: WebGL2RenderingContext,
      gpu_addresses: GPUAddresses,
      uniforms: Uniforms,
      model_transform: math.Mat4,
      material: Material,
    ): void;
    static default_values(): Record<string, any>;
    static mapping_UBO(): UBOBinding;
    static assign_camera(camera_inverse: math.Mat4, uniforms: Uniforms): void;
  }

  export class Texture {
    gpu_instances: Map<WebGL2RenderingContext, TextureGPUInstance>;
    filename: string;
    min_filter: keyof WebGL2RenderingContext;
    image: HTMLImageElement;
    ready?: boolean;

    constructor(filename: string, min_filter?: keyof WebGL2RenderingContext);
    copy_onto_graphics_card(
      context: WebGL2RenderingContext,
      need_initial_settings?: boolean,
    ): TextureGPUInstance;
    activate(context: WebGL2RenderingContext, texture_unit?: number): void;
  }

  export class Shadow_Map {
    gpu_instances: Map<WebGL2RenderingContext, ShadowMapGPUInstance>;
    width: number;
    height: number;
    min_filter: keyof WebGL2RenderingContext;
    mag_filter: keyof WebGL2RenderingContext;
    ready: boolean;

    constructor(
      width: number,
      height: number,
      min_filter?: keyof WebGL2RenderingContext,
      mag_filter?: keyof WebGL2RenderingContext,
    );

    copy_onto_graphics_card(
      context: WebGL2RenderingContext,
    ): ShadowMapGPUInstance;
    activate(
      gl: WebGL2RenderingContext,
      texture_unit?: number,
      treat_as_fbo?: boolean,
    ): void;
    deactivate(caller: Component, treat_as_fbo?: boolean): void;
  }

  export class Component {
    props: ComponentProps;
    uniforms: Uniforms;
    animated_children: Component[]; // TODO: verify this is correct?
    document_children: Component[]; // TODO: verify this is correct?
    key_controls: widgets.Keyboard_Manager;
    canvas: HTMLCanvasElement;
    context: WebGL2RenderingContext;
    prev_time: number;
    event: number; // return from requestAnimationFrame
    width?: number;
    height?: number;

    control_panel: HTMLDivElement;
    div: HTMLDivElement;
    document_region: HTMLDivElement;
    program_stuff: HTMLDivElement;

    widget_options: ComponentLayoutOptions;
    embedded_controls_area: HTMLDivElement;
    embedded_controls: widgets.Controls_Widget;
    embedded_code_nav_area: HTMLDivElement;
    embedded_code_nav: widgets.Controls_Widget;
    embedded_editor_area: HTMLDivElement;
    embedded_editor: widgets.Controls_Widget;

    static types_used_before: Set<Constructor<any>>;

    constructor(props?: ComponentProps);

    static default_uniforms(): DefaultUniforms;
    static initialize_CSS(
      classType: Constructor<any>,
      rules: readonly string[],
    ): void;
    make_context(
      canvas: HTMLCanvasElement,
      background_color?: math.Vector4,
      dimensions?: [number, number],
    ): void;
    set_canvas_size(dimensions?: [number, number]): void;
    frame_advance(time?: number): void;
    new_line(parent?: HTMLElement): void;
    live_string(
      callback: (elem: HTMLDivElement) => void,
      parent?: HTMLElement,
    ): void;
    key_triggered_button(
      description: string,
      shortcut_combination: Array<KeyboardEvent["key"]>,
      callback: (this: Component) => void,
      color?: string,
      release_event?: (this: Component) => void,
      recipient?: Component,
      parent?: HTMLElement,
    ): void;
    render_layout(div: HTMLDivElement, options?: ComponentLayoutOptions): void;
    init(): void;
    render_animation(context: Component): void;
    render_explanation(...args: any[]): void;
    render_controls(...args: any[]): void;
  }

  export class UBO {
    items: Record<string, UBOItems>;
    gl: WebGL2RenderingContext;
    buffer_name: string;
    buffer: WebGLBuffer;
    binding_point: number;
    static Cache: { [key: string]: UBO };

    constructor(
      gl: WebGL2RenderingContext,
      buffer_name: string,
      buffer_size: number,
      buffer_layout: UBOBlockLayout[],
    );
    bind(binding_point: number): void;
    update(
      buffer_name: string,
      buffer_data: UBOBuffer,
      num_instance?: number,
    ): this;
    static create(
      gl: WebGL2RenderingContext,
      block_name: string,
      buffer_layout: UBOBlockLayout[],
    ): void;
    static get_size(type: UBOCacheSizeType): [number, number];
    static calculate(buffer_layout: UBOLayoutItem[]): number;
  }

  export const math: typeof MathNamespace;
  export const widgets: typeof WidgetsNamespace;
}
