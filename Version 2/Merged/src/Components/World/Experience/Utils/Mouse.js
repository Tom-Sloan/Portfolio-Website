import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.instance = {};
    this.instance.x = 0;
    this.instance.y = 0;

    window.addEventListener("mousemove", (event) => {
      this.instance.x = event.clientX / this.sizes.width - 0.5;
      this.instance.y = event.clientY / this.sizes.height - 0.5;
      this.trigger("mousemove");
    });
  }
}
