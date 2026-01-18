import { tiny } from "../tiny-graphics.js";
import { defs } from "../examples/common.js";
import { math } from "tiny-graphics-math.js";

export class Demo extends tiny.Component {
  render_controls(): void {
    // minimal working example
    this.key_triggered_button("my button", ["Control", "0"], () => console.log("pressed"));
  }
}
