import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

export default class Camera {
  constructor(orbit) {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.time = this.experience.time;

    this.xLocation = 8;
    this.yLocation = 15;
    this.zLocation = 8;
    this.debug = this.experience.debug;

    this.parallaxMultiplier = 1;

    this.setGroup();
    this.setInstance();

    if (orbit == null) orbit = true;
    this.orbit = orbit;
    if (orbit) this.setControls();

    this.orbit = orbit;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Camera");
      this.debugFolder
        .add(this, "parallaxMultiplier")
        .name("parallaxMultiplier")
        .min(0)
        .max(10)
        .step(0.001);
    }
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(this.xLocation, this.yLocation, this.zLocation);
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
      (parallaxX - this.cameraGroup.position.x) *
      this.parallaxMultiplier *
      this.time.deltaMS;
    this.cameraGroup.position.y +=
      (parallaxY - this.cameraGroup.position.y) *
      this.parallaxMultiplier *
      this.time.deltaMS;
  }

  savePostition(location) {
    this.xLocation = this.instance.position.x - location.x;
    this.yLocation = this.instance.position.y;
    this.zLocation = this.instance.position.z - location.z;
  }

  movePosition(location) {
    let xVal = this.xLocation + location.x;
    let zVal = this.zLocation + location.z;

    this.instance.position.setX(xVal);
    this.instance.position.setZ(zVal);

    if (this.orbit) {
      gsap.to(this.controls.target, {
        duration: 0.8,
        overwrite: "auto",
        x: location.x,
        z: location.z,
        onUpdate: this.updateControlsAnimation,
        onUpdateParams: [this],
      });
    }
  }

  updateControlsAnimation(instance) {
    instance.controls.update();
  }

  update() {
    if (this.orbit) this.controls.update();
  }
}
