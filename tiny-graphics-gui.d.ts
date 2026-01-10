import type { Component } from "./tiny-graphics";

interface TinyDefs {
  [key: string]: any;
}

interface WidgetOptions {
  code_in_focus?: Component;
  hide_navigator?: boolean;
  rows?: number;
  [key: string]: any;
}

interface SavedControls {
  shortcut_combination: Array<KeyboardEvent["key"]>;
  callback: (event: KeyboardEvent) => void;
  keyup_callback: (event: KeyboardEvent) => void;
}

declare class Controls_Widget {
  row: HTMLTableRowElement;
  panels: Array<HTMLTableCellElement>;
  component: Component;
  timestamp: number;
  event: number;

  constructor(component: Component, options?: WidgetOptions);

  make_panels(time: number): void;
  render(time?: number): void;
}

declare class Keyboard_Manager {
  saved_controls: SavedControls;
  actively_pressed_keys: Set<KeyboardEvent>;
  callback_behavior: (event: KeyboardEvent) => void;

  constructor(
    target: EventTarget,
    callback_behavior: (
      callback: (event: KeyboardEvent) => void,
      event: KeyboardEvent
    ) => void
  );

  key_down_handler(event: KeyboardEvent): void;
  key_up_handler(event: KeyboardEvent): void;
  add(
    shortcut_combination: Array<KeyboardEvent["key"]>,
    callback: (event: KeyboardEvent) => void,
    keyup_callback: (event: KeyboardEvent) => void
  ): void;
}

declare class Code_Manager {
  tokens: {
    type: string;
    value: string;
  }[];
  no_comments: string[];

  constructor(code: string);
}

declare class Code_Widget {
  component: Component;
  definitions: TinyDefs;
  code_display: HTMLDivElement;

  constructor(component: Component, options?: WidgetOptions);

  build_reader(
    element: HTMLElement,
    main_scene: Component,
    definitions: TinyDefs
  ): void;
  build_navigator(element: HTMLElement, main_scene: Component): void;
  display_code(code_in_focus: Component): void;
  format_code(code_string: string): void;
}

declare class Editor_Widget {
  component: Component;
  options: WidgetOptions;
  form: HTMLFormElement;
  run_button: HTMLButtonElement;
  submit: HTMLButtonElement;
  author_box: HTMLInputElement;
  password_box: HTMLInputElement;
  overwrite_panel: HTMLSpanElement;
  submit_result: HTMLDivElement;
  new_demo_code: HTMLTextAreaElement;

  constructor(component: Component, options?: WidgetOptions);

  select_class(class_definition: Component): void;
  fetch_handler(url: RequestInfo | URL, body: BodyInit): void;
  submit_demo(): Promise<void>;
}

export const widgets: {
  Controls_Widget: typeof Controls_Widget;
  Keyboard_Manager: typeof Keyboard_Manager;
  Code_Manager: typeof Code_Manager;
  Code_Widget: typeof Code_Widget;
  Editor_Widget: typeof Editor_Widget;
};
