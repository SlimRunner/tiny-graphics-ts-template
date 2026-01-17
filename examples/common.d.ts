import type { ShaderDefs } from "./common-shaders";
import type { ShapeDefs } from "./common-shapes";
import type { ComponentDefs } from "./common-components";

declare class Camera {}

declare class Light {}

declare class Material {}

declare class Material_From_File {}

declare class Entity {}

declare class Renderer {}

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
