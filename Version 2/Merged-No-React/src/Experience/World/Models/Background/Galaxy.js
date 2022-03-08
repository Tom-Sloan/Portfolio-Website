import * as THREE from "three";
import Experience from "../../../Experience.js";
import galaxyVertexShader from "../../shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "../../shaders/galaxy/fragment.glsl";

export default class Galaxy {
  constructor() {
    //getting experience and required variables
    this.experience = new Experience();
    this.scene = this.experience.scene; // to add to scene
    this.time = this.experience.time; // to get elapse time for animation
    this.debug = this.experience.debug; // to add debug panel
    this.renderer = this.experience.renderer; // to get pixel ratio

    // for ease of debugging
    this.parameters = {};
    this.parameters.count = 200000; //number of stars
    this.parameters.size = 0.005; //the size of the stars
    this.parameters.radius = 5; //the radius of the star system
    this.parameters.branches = 3; // the number of branches
    this.parameters.randomness = 0.2; // to add random ness in placement
    this.parameters.randomnessPower = 3; // how much more random things will get near edges
    this.parameters.insideColor = "#ff6030"; // center color
    this.parameters.outsideColor = "#1b3984"; // edge color

    this.geometry = null; // used so we don't keep recreating points, geometries and materials
    this.material = null;
    this.points = null;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Galaxy");
      this.debugFolder.close();
      this.setDebug();
    }

    this.generate();
  }

  generate() {
    //removes points if there are alreay there
    if (this.points !== null) {
      console.log(this);
      this.geometry.dispose();
      this.material.dispose();
      this.scene.remove(this.points);
    }

    /**
     * Geometry
     */
    this.geometry = new THREE.BufferGeometry();

    // Positions of stars
    const positions = new Float32Array(this.parameters.count * 3);

    // amount away from the center of the branch a point is
    const randomness = new Float32Array(this.parameters.count * 3);

    // Color of said point
    const colors = new Float32Array(this.parameters.count * 3);

    // used to apply randomness to point size
    const scales = new Float32Array(this.parameters.count * 1);

    // inside and outside color
    const insideColor = new THREE.Color(this.parameters.insideColor);
    const outsideColor = new THREE.Color(this.parameters.outsideColor);

    // for every point
    for (let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;

      // distance awway from center
      const radius = Math.random() * this.parameters.radius;

      // branch to go on
      const branchAngle =
        ((i % this.parameters.branches) / this.parameters.branches) *
        Math.PI *
        2;

      // get randomness to apply and give distance away from branch
      const randomX =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;
      const randomY =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), this.parameters.randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.parameters.randomness *
        radius;

      // record the position of the point
      positions[i3] = Math.cos(branchAngle) * radius;
      positions[i3 + 1] = -10;
      positions[i3 + 2] = Math.sin(branchAngle) * radius;

      // record the randomness on each point
      randomness[i3] = randomX;
      randomness[i3 + 1] = randomY;
      randomness[i3 + 2] = randomZ;

      // Generate the color of the point at that distance from the center
      const mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, radius / this.parameters.radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // record the scale of the point to apply to the size
      scales[i] = Math.random();
    }

    // record the attribute of the points
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(randomness, 3)
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    /**
     * this.material
     */
    this.material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 30 * this.renderer.instance.getPixelRatio() },
      },
      vertexShader: galaxyVertexShader,
      fragmentShader: galaxyFragmentShader,
    });

    /**
     * Points
     */
    this.points = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.points);
  }

  setDebug() {
    this.debugFolder
      .add(this.parameters, "count")
      .min(100)
      .max(1000000)
      .step(100)
      .onFinishChange(() => this.generate());
    this.debugFolder
      .add(this.parameters, "radius")
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(() => this.generate());
    this.debugFolder
      .add(this.parameters, "branches")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(() => this.generate());
    this.debugFolder
      .add(this.parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(() => this.generate());
    this.debugFolder
      .add(this.parameters, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(() => this.generate());
    this.debugFolder
      .addColor(this.parameters, "insideColor")
      .onFinishChange(() => this.generate());
    this.debugFolder
      .addColor(this.parameters, "outsideColor")
      .onFinishChange(() => this.generate());
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed / 1000;
  }
}
