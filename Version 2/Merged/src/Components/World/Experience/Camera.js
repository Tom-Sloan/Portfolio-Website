import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.time = this.experience.time;

    this.setGroup();
    this.setInstance();
    this.setControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(6, 4, 8);
    this.cameraGroup.add(this.instance);
  }
  setGroup() {
    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas.current);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }
  updatePosition() {
    const mouse = this.experience.mouse.instance;
    const parallaxX = mouse.x;
    const parallaxY = -mouse.y;

    this.cameraGroup.position.x +=
      (parallaxX - this.cameraGroup.position.x) * 5 * this.time.deltaMS;
    this.cameraGroup.position.y +=
      (parallaxY - this.cameraGroup.position.y) * 5 * this.time.deltaMS;
  }
  update() {
    this.controls.update();
  }
}
