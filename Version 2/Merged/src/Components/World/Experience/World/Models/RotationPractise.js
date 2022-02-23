import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";

export default class RotationPractise {
  constructor(position) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.mouse = this.experience.mouse;
    this.floors = this.experience.world.floors;

    this.position = position;
    this.offset = 0;

    this.colorList = [
      new THREE.Color("blue"),
      new THREE.Color("orange"),
      new THREE.Color("brown"),
      new THREE.Color("purple"),
      new THREE.Color("red"),
      new THREE.Color("green"),
    ];

    this.setCube();
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Cube");
      this.setDebug();
    }
  }
  setCube() {
    this.geometry = new THREE.BoxGeometry(3, 3, 3);
    const len = this.geometry.attributes.position.array.length / 3;
    this.colors = new Float32Array(len * 3);
    let selector = 0;
    for (let i = 0; i < len; i++) {
      if (i % (len / 6) === 0 && i !== 0) {
        selector++;
      }
      this.colors[i * 3 + 0] = this.colorList[selector].r;
      this.colors[i * 3 + 1] = this.colorList[selector].g;
      this.colors[i * 3 + 2] = this.colorList[selector].b;
    }
    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.colors, 3)
    );

    this.material = new THREE.MeshBasicMaterial({
      vertexColors: true,
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.visible = false;
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
  }

  update() {
    this.intersect = this.mouse.intersect(this.floors.getFloorsArrayMeshs());
    // console.log(this.intersect);
    if (this.intersect.length) {
      this.point = this.intersect[0].point;
      this.offset = 0;
      const yRot = this.getYRot(this.point);
      // // const temp = new THREE.Vector3();
      // // this.point.getWorldPosition(temp);
      // this.point.y = this.cube.position.y;
      // // console.log(this.point);
      // this.cube.lookAt(this.point);

      // let yRot =
      //   Math.abs(this.cube.rotation.x) === 0
      //     ? this.cube.rotation.y
      //     : this.cube.rotation.y < 0
      //     ? -Math.PI - this.cube.rotation.y
      //     : Math.PI - this.cube.rotation.y;

      console.log(yRot);
      this.offset = yRot;
      const destination = this.experience.world.floors.getAllDestinations();
      const nearest = this.experience.world.floors.getNearestOfType(
        destination,
        this.point
      );
      nearest.forEach((n, i) => console.log(n.name, this.getYRot(n.position)));
      // const model = this.experience.world.fox.model;

      // gsap.to(model.rotation, {
      //   duration: 0.5,
      //   ease: "linear",
      //   overwrite: "auto",
      //   y: yRot,
      // });
    }
  }

  getYRot(location) {
    location.y = this.cube.position.y;

    this.cube.lookAt(location);
    let initalAngle =
      (Math.abs(this.cube.rotation.x) === 0
        ? this.cube.rotation.y
        : this.cube.rotation.y < 0
        ? -Math.PI - this.cube.rotation.y
        : Math.PI - this.cube.rotation.y) - this.offset;

    initalAngle =
      initalAngle <= Math.PI && initalAngle >= -Math.PI
        ? initalAngle
        : initalAngle < -Math.PI
        ? initalAngle + 2 * Math.PI
        : initalAngle - 2 * Math.PI;
    return initalAngle;
  }
  setPosition(location) {
    this.cube.position.set(location.x, location.y, location.z);
  }
  setDebug() {
    this.debugFolder
      .add(this.cube.rotation, "x")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01);
    this.debugFolder
      .add(this.cube.rotation, "y")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01);
    this.debugFolder
      .add(this.cube.rotation, "z")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01);
    this.debugFolder.add(this.cube, "visible");
  }
}
