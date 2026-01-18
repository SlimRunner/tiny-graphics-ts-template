import { Component, ComponentProps } from "../tiny-graphics";
import { Mat4, Vector, Vector3 } from "../tiny-graphics-math";

declare class Movement_Controls extends Component {
  roll: number;
  look_around_locked: boolean;
  thrust: Vector3;
  pos: Vector3;
  z_axis: Vector3;
  radians_per_frame: number;
  meters_per_frame: number;
  speed_multiplier: number;
  mouse_enabled_canvases: Set<HTMLCanvasElement>;
  will_take_over_uniforms: boolean;
  mouse: {
    from_center: Vector<2>;
    anchor?: Vector<2>;
  };

  matrix: () => Mat4;
  inverse: () => Mat4;

  constructor(props: ComponentProps, update_callback: () => void);

  set_recipient(matrix_closure: () => Mat4, inverse_closure: () => Mat4): void;
  reset(): void;
  add_mouse_controls(canvas: HTMLCanvasElement): void;
  render_explanation(
    document_builder: Component,
    document_element?: HTMLDivElement,
  ): void;
  render_controls(): void;
  first_person_flyaround(
    radians_per_frame: number,
    meters_per_frame: number,
    leeway?: number,
  ): void;
  third_person_arcball(radians_per_frame: number): void;
  render_animation(caller: Component): void;
}

type ComponentDefs = {
  Movement_Controls: typeof Movement_Controls;
};

export declare const defs: ComponentDefs;
