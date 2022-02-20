import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";

export default class RotationPractise {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.mouse = this.experience.mouse;
    this.floors = this.experience.world.floors;

    this.colorList = [
      new THREE.Color("blue"),
      new THREE.Color("orange"),
      new THREE.Color("brown"),
      new THREE.Color("purple"),
      new THREE.Color("red"),
      new THREE.Color("green"),
    ];
    this.debugFolder = this.debug.ui.addFolder("Cube");
    this.setCube();
    this.setDebug();
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

    this.material = new THREE.MeshBasicMaterial({ vertexColors: true });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
  }
  update() {
    this.intersect = this.mouse.intersect(this.floors.getFloorsArrayMeshs());
    // console.log(this.intersect);
    if (this.intersect.length) {
      this.point = this.intersect[0].point;
      let sph = new THREE.Spherical();
      sph.setFromVector3(this.point);

      gsap.to(this.cube.rotation, {
        duration: 0.5,
        ease: "linear",
        overwrite: "auto",
        y: sph.theta,
      });
    }
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
  }
}
