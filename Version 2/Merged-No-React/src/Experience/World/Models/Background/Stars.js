import * as THREE from "three";
import Experience from "../../../Experience.js";
export default class Stars {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.particlesCount = 20000;
    this.positions = new Float32Array(this.particlesCount * 3);
    this.range = 10;
    this.color = "#ffeded";

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Stars");
      this.debugFolder.close();
      this.setDebug();
    }

    this.generate();
  }
  generate() {
    for (let i = 0; i < this.particlesCount; i++) {
      this.positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      this.positions[i * 3 + 1] = this.range * 0.5 - Math.random() * this.range;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3)
    );

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: this.color,
      sizeAttenuation: this.resources.items.starsAttenuationTexture,
      size: 0.03,
    });

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(particles);
  }

  setDebug() {}
}
