import * as THREE from "three";
import Experience from "../../../Experience.js";
import galaxyVertexShader from "../../shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "../../shaders/galaxy/fragment.glsl";

export default class Particles {
  constructor() {
    //getting experience and required variables
    this.experience = new Experience();
    this.scene = this.experience.scene; // to add to scene
    this.time = this.experience.time; // to get elapse time for animation
    this.debug = this.experience.debug; // to add debug panel
    this.renderer = this.experience.renderer; // to get pixel ratio
    this.resources = this.experience.resources;

    this.particlesCount = 20000;
    this.positions = new Float32Array(this.particlesCount * 3);
    this.scales = new Float32Array(this.particlesCount * 1); // used to apply randomness to point size
    this.depth = 75;
    this.colors = new Float32Array(this.particlesCount * 3);
    this.size = 0.35;
    this.range = 100;
    this.color = new THREE.Color("orange");

    this.geometry = null; // used so we don't keep recreating points, geometries and materials
    this.material = null;
    this.points = null;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Stars");
      this.debugFolder.close();
      this.setDebug();
    }

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
      this.positions[i * 3 + 0] = (Math.random() - 0.5) * this.range;
      this.positions[i * 3 + 1] = this.depth * 0.5 - Math.random() * this.depth;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * this.range;

      // record the scale of the point to apply to the size
      this.scales[i] = Math.random();

      // GEt the colors
      this.colors[i * 3 + 0] = this.color.r;
      this.colors[i * 3 + 1] = this.color.g;
      this.colors[i * 3 + 2] = this.color.b;
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
      color: this.color,
      sizeAttenuation: true,
      size: this.size,
      map: this.resources.items.particleTexture,
      transparent: true,
      alphaMap: this.resources.items.particleTexture,
      // alphaTest: 0.001,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    // this.material = new THREE.ShaderMaterial({
    //   depthWrite: false,
    //   blending: THREE.AdditiveBlending,
    //   vertexColors: true,
    //   uniforms: {
    //     uTime: { value: 0 },
    //     uSize: {
    //       value: this.size * 1000 * this.renderer.instance.getPixelRatio(),
    //     },
    //   },
    //   vertexShader: galaxyVertexShader,
    //   fragmentShader: galaxyFragmentShader,
    // });
  }

  setDebug() {
    // this.particlesCount = 20000;
    // this.positions = new Float32Array(this.particlesCount * 3);
    // this.depth = 300;
    // this.colors = "#ffeded";
    // this.size = 0.03;
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
      .max(0.4)
      .step(0.001)
      .onFinishChange(() => this.generate());
    this.debugFolder.add(params, "printThis");
  }
}
