import Experience from "../Experience";
import EventEmitter from "./EventEmitter";
import * as THREE from "three";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.camera = this.experience.camera;
    this.instance = {};

    this.instance.clicked = false;

    //RAnge from -0.5 - 0.5
    this.instance.x = 0;
    this.instance.y = 0;

    //Range from -1 to 1
    this.instance.xTO1 = 0;
    this.instance.yTO1 = 0;

    window.addEventListener("mousemove", (event) => {
      this.instance.x = event.clientX / this.sizes.width - 0.5;
      this.instance.y = event.clientY / this.sizes.height - 0.5;
      this.trigger("mousemove");
    });

    window.addEventListener("click", (event) => {
      this.instance.xTO1 = (event.clientX / this.sizes.width) * 2 - 1;
      this.instance.yTO1 = -(event.clientY / this.sizes.height) * 2 + 1;
      this.instance.clicked = true;
      this.trigger("mouseclick");
    });
    window.addEventListener("keypress", (event) => {
      if (event.key === "w") {
        this.trigger("cameraChange");
      }
    });
  }

  //Array
  intersect(object) {
    this.updateRaycaster();
    return this.camera.intersect(object);
  }

  updateRaycaster() {
    this.camera.updateRaycaster({
      x: this.instance.xTO1,
      y: this.instance.yTO1,
    });
  }
}
