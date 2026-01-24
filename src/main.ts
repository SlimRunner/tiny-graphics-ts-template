import { ComponentLayoutOptions, tiny } from "../tiny-graphics.js";
import { defs } from "../examples/common.js";
import { math } from "../tiny-graphics-math.js";

interface Material {
  shader: tiny.Shader;
  ambient: number;
  diffusivity: number;
  specularity: number;
  color: math.Vector4;
}

class Transforms_Sandbox_Base extends tiny.Component {
  swarm: boolean = false;
  hover: boolean = false;
  shapes?: {
    box: defs.Cube;
    ball: defs.Subdivision_Sphere;
  };
  materials?: {
    plastic: Material;
    metal: Material;
  };
  t: number = 0;
  controls?: any;

  init(): void {
    this.swarm = false;
    this.hover = false;

    this.shapes = {
      box: new defs.Cube(),
      ball: new defs.Subdivision_Sphere(4),
    };

    const phong = new defs.Phong_Shader();
    this.materials = {
      plastic: {
        shader: phong,
        ambient: 0.2,
        diffusivity: 1,
        specularity: 0.5,
        color: math.color(0.9, 0.5, 0.9, 1),
      },
      metal: {
        shader: phong,
        ambient: 0.2,
        diffusivity: 1,
        specularity: 1,
        color: math.color(0.9, 0.5, 0.9, 1),
      },
    };
  }

  render_controls(): void {
    if (this.control_panel) {
      this.control_panel.innerHTML += "Dragonfly rotation angle: <br>";
    }

    this.live_string((box) => {
      box.textContent =
        (this.hover ? 0 : (this.t ?? 0 % (2 * Math.PI)).toFixed(2)) +
        " radians";
    });
    this.new_line();

    this.key_triggered_button("(Un)pause animation", ["Alt", "a"], () => {
      this.uniforms.animate ??= !this.uniforms?.animate;
    });
    this.new_line();
    this.key_triggered_button("Hover dragonfly in place", ["h"], () => {
      this.hover = !this.hover;
    });
    this.new_line();
    this.key_triggered_button("Swarm mode", ["m"], () => {
      this.swarm = !this.swarm;
    });
  }

  render_animation(context: Transforms_Sandbox_Base): void {
    // if (context.controls)
  }
}

export class Demo extends tiny.Component {
  render_layout(div: HTMLDivElement, options?: ComponentLayoutOptions): void {
    this.div = div;
    div.className = "documentation_treenode";

    div.style.margin = "auto";
    div.style.width = "1080px";

    const rules = [
      `.documentation-big { width:1030px; padding:0 25px; font-size: 29px; font-family: Arial`,
      `.documentation-big-top { padding: 30px 25px }`,
    ];

    tiny.Component.initialize_CSS(Demo, rules);

    const region_1 = div.appendChild(document.createElement("div"));
    region_1.classList.add(
      "documentation",
      "documentation-big",
      "documentation-big-top",
    );

    region_1.appendChild(document.createElement("p"));
    region_1.textContent = `Welcome to Demopedia.  The WebGL demo below can be edited, remixed, and saved at a new  URL.`;

    region_1.appendChild(document.createElement("p"));
    region_1.textContent = `Below that you'll find the starting code for a graphics assignment. Your goal is to model an insect.`;

    region_1.appendChild(document.createElement("p"));
    region_1.textContent = `Try making changes to the code below.  The code comments suggest how to do so.  Once you have
         modeled an insect, save your result to a URL you can share!`;

    region_1.appendChild(document.createElement("p"));
    region_1.textContent = `First, the demo:`;

    const canvas = div.appendChild(document.createElement("canvas"));
    canvas.style = `width:1080px; height:600px; background:DimGray; margin:auto; margin-bottom:-4px`;

    // this.animated_children.push(new )

    this.make_context(canvas);
    this.set_canvas_size([1080, 400]);

    this.event = window.requestAnimationFrame(this.frame_advance.bind(this));

    const region_2 = div.appendChild(document.createElement("p"));
    region_2.textContent = `Next, type here to edit the code, which is drawing the above:`;

    this.embedded_editor_area = div.appendChild(document.createElement("div"));
    this.embedded_editor_area.className = "editor-widget";
  }

  render_controls(): void {
    // minimal working example
    this.key_triggered_button("my button", ["Control", "0"], () =>
      console.log("pressed"),
    );
  }
}
