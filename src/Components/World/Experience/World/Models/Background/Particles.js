import * as THREE from "three";
import Experience from "../../../Experience.js";

export default class Particles {
  constructor(location, range) {
    //getting experience and required variables
    this.experience = new Experience();
    this.scene = this.experience.scene; // to add to scene
    this.time = this.experience.time; // to get elapse time for animation
    this.debug = this.experience.debug; // to add debug panel
    this.renderer = this.experience.renderer; // to get pixel ratio
    this.resources = this.experience.resources;

    this.location = location;
    this.particlesCount = 10000;
    this.positions = new Float32Array(this.particlesCount * 3);
    this.scales = new Float32Array(this.particlesCount * 1); // used to apply randomness to point size
    this.depth = 10;
    this.height = 35;
    this.colors = new Float32Array(this.particlesCount * 3);
    this.size = 0.35;
    this.range = range;

    this.colorList = [
      new THREE.Color("rgb(255, 163, 110)"),
      new THREE.Color("rgb(195, 80, 248)"),
      new THREE.Color("rgb(77, 86, 247)"),
    ];
    // console.log(this.color);
    this.geometry = null; // used so we don't keep recreating points, geometries and materials
    this.material = null;
    this.points = null;

    // Debug
    // if (this.debug.active) {
    //   this.debugFolder = this.debug.ui.addFolder("Stars");
    //   this.debugFolder.close();
    //   this.setDebug();
    // }

    this.generate();
  }
  generate() {
    //removes points if there are alreay there
    if (this.points !== null) {
      //   console.log(this);
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.points);
      this.positions = new Float32Array(this.particlesCount * 3);
      this.scales = new Float32Array(this.particlesCount * 1);
      this.colors = new Float32Array(this.particlesCount * 3);
    }

    for (let i = 0; i < this.particlesCount; i++) {
      this.positions[i * 3 + 0] =
        (Math.random() - 0.5) * this.range + this.location.x;
      this.positions[i * 3 + 1] = -this.depth + Math.random() * this.height;
      this.positions[i * 3 + 2] =
        (Math.random() - 0.5) * this.range + this.location.z;

      // record the scale of the point to apply to the size
      this.scales[i] = Math.random();

      // GEt the colors
      const selector = Math.floor(Math.random() * this.colorList.length);
      this.colors[i * 3 + 0] = this.colorList[selector].r;
      this.colors[i * 3 + 1] = this.colorList[selector].g;
      this.colors[i * 3 + 2] = this.colorList[selector].b;
    }

    this.generateGeometry();

    // Material
    this.generateMaterial();

    // Points
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  generateGeometry() {
    // Create Goemetry
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );
    this.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(this.scales, 1)
    );
    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(this.colors, 3)
    );
  }

  generateMaterial() {
    this.material = new THREE.PointsMaterial({
      sizeAttenuation: true,
      size: this.size,
      vertexColors: true,
      map: this.resources.items.particleTexture,
      // transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }
  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.points);
  }

  setDebug() {
    const params = {};
    params.printThis = () => console.log(this);
    this.debugFolder
      .add(this, "particlesCount")
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(() => this.generate());

    this.debugFolder
      .add(this, "depth")
      .min(1)
      .max(100)
      .step(1)
      .onFinishChange(() => this.generate());

    this.debugFolder
      .add(this, "range")
      .min(10)
      .max(1000)
      .step(1)
      .onFinishChange(() => this.generate());

    this.debugFolder
      .add(this, "size")
      .min(0.001)
      .max(1)
      .step(0.001)
      .onFinishChange(() => this.generate());
    this.debugFolder.add(params, "printThis");
  }
}
