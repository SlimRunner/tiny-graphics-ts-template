import type {
  Mat4,
  Matrix,
  Vector,
  Vector3,
  Vector4,
  VectorLike,
} from "./tiny-graphics-math";
import type { Keyboard_Manager, Controls_Widget } from "./tiny-graphics-gui";

import * as math from "./tiny-graphics-math";
import * as widgets from "./tiny-graphics-gui";

interface DefaultUniforms {
  camera_inverse: Mat4;
  camera_transform: Mat4;
  projection_transform: Mat4;
  animate: boolean;
  animation_time: number;
  animation_delta_time: number;
}

type Uniforms = DefaultUniforms & {
  [key: string]: any;
};

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

interface ShaderGPUInstance {
  program?: WebGLProgram;
  gpu_addresses?: Record<string, unknown>;
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
  position: Vector3;
  // color?: Vector4;
  // normal?: Vector3;
  // texture_coord?: Vector<2>;
  [attribute: string]: number | VectorLike<any> | Matrix<any, any> | undefined;
}

type ShapeArrays = ShapeVertex & {
  normal: Vector4;
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
  | "Mat4"
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

// ==============================================================

declare class Shape {
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
    divisor?: number
  ): void;
  copy_onto_graphics_card(
    context: WebGL2RenderingContext,
    write_to_indices?: boolean
  ): ShapeGPUInstance;
  execute_shaders(
    gl: WebGL2RenderingContext,
    gpu_instance: ShapeGPUInstance,
    type: keyof WebGL2RenderingContext,
    instances: GLsizei
  ): void;
  draw(
    webgl_manager: Component,
    uniforms: Uniforms,
    model_transform: Mat4,
    material: Shader, // TODO: should it really be Shader?
    type?: keyof WebGL2RenderingContext,
    instances?: GLsizei
  ): void;
  static insert_transformed_copy_into(
    recipient: Shape,
    args: any[], // TODO: improve when you type common.js
    points_transform?: Mat4
  ): void;
  make_flat_shaded_version(): abstract new (...args: any[]) => this;
  duplicate_the_shared_vertices(): void;
  flat_shade(): void;
  normalize_positions(keep_aspect_ratios?: boolean): void;
}

declare class Shader {
  gpu_instances: Map<WebGL2RenderingContext, ShaderGPUInstance>;

  copy_onto_graphics_card(context: WebGL2RenderingContext): ShaderGPUInstance;
  activate(
    context: WebGL2RenderingContext,
    uniforms: Uniforms,
    model_transform: Mat4,
    material: Shader
  ): void;
  init_UBO(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    ubo_binding: UBOBinding
  ): void;
  bind_UBO(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    shader_name: string,
    binding_point: number
  ): void;
  vertex_glsl_code(): string;
  fragment_glsl_code(): string;
  update_GPU(
    context: WebGL2RenderingContext,
    gpu_addresses: Record<string, unknown>,
    uniforms: Uniforms,
    model_transform: Mat4,
    material: Shader // TODO: should it really be Shader?
  ): void;
  static default_values(): Record<string, any>;
  static mapping_UBO(): UBOBinding;
  static assign_camera(camera_inverse: Mat4, uniforms: Uniforms): void;
}

declare class Texture {
  gpu_instances: Map<WebGL2RenderingContext, TextureGPUInstance>;
  filename: string;
  min_filter: keyof WebGL2RenderingContext;
  image: HTMLImageElement;
  ready?: boolean;

  constructor(filename: string, min_filter?: keyof WebGL2RenderingContext);
  copy_onto_graphics_card(
    context: WebGL2RenderingContext,
    need_initial_settings?: boolean
  ): TextureGPUInstance;
  activate(context: WebGL2RenderingContext, texture_unit?: number): void;
}

declare class Shadow_Map {
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
    mag_filter?: keyof WebGL2RenderingContext
  );

  copy_onto_graphics_card(
    context: WebGL2RenderingContext
  ): ShadowMapGPUInstance;
  activate(
    gl: WebGL2RenderingContext,
    texture_unit?: number,
    treat_as_fbo?: boolean
  ): void;
  deactivate(caller: Component, treat_as_fbo?: boolean): void;
}

declare class Component {
  props: ComponentProps;
  animated_children: Component[]; // TODO: verify this is correct?
  document_children: Component[]; // TODO: verify this is correct?
  key_controls: Keyboard_Manager;
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
  prev_time: number;
  event: number; // return from requestAnimationFrame

  control_panel: HTMLDivElement;
  div: HTMLDivElement;
  document_region: HTMLDivElement;
  program_stuff: HTMLDivElement;

  widget_options: ComponentLayoutOptions;
  embedded_controls_area: HTMLDivElement;
  embedded_controls: Controls_Widget;
  embedded_code_nav_area: HTMLDivElement;
  embedded_code_nav: Controls_Widget;
  embedded_editor_area: HTMLDivElement;
  embedded_editor: Controls_Widget;

  static types_used_before: Set<Constructor<any>>;

  constructor(props?: ComponentProps);

  static default_uniforms(): DefaultUniforms;
  static initialize_CSS(
    classType: Constructor<any>,
    rules: readonly string[]
  ): void;
  make_context(
    canvas: HTMLCanvasElement,
    background_color?: Vector4,
    dimensions?: [number, number]
  ): void;
  set_canvas_size(dimensions?: [number, number]): void;
  frame_advance(time?: number): void;
  new_line(parent?: HTMLElement): void;
  live_string(
    callback: (elem: HTMLDivElement) => void,
    parent?: HTMLElement
  ): void;
  key_triggered_button(
    description: string,
    shortcut_combination: Array<KeyboardEvent["key"]>,
    callback: (this: Component) => void,
    color?: string,
    release_event?: (this: Component) => void,
    recipient?: Component,
    parent?: HTMLElement
  ): void;
  render_layout(div: HTMLDivElement, options?: ComponentLayoutOptions): void;
  init(): void;
  render_animation(context: Component): void;
  render_explanation(): void;
  render_controls(): void;
}

declare class UBO {
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
    buffer_layout: UBOBlockLayout[]
  );
  bind(binding_point: number): void;
  update(
    buffer_name: string,
    buffer_data: Float32Array | number[] | number,
    num_instance?: number
  ): this;
  static create(
    gl: WebGL2RenderingContext,
    block_name: string,
    buffer_layout: UBOBlockLayout[]
  ): void;
  static get_size(type: UBOCacheSizeType): [number, number];
  static calculate(buffer_layout: UBOLayoutItem[]): number;

}

type Tiny = typeof math & typeof widgets & {
  math: typeof math;
  widgets: typeof widgets;
  Shape: typeof Shape;
  Shader: typeof Shader;
  Texture: typeof Texture;
  Shadow_Map: typeof Shadow_Map;
  Component: typeof Component;
  UBO: typeof UBO;
}

export const tiny: Tiny;
