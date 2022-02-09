import * as THREE from "three";
import Experience from "../../Experience";

export default class ModelRaycaster {
  constructor(location) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (!location) {
      location = { x: 0, y: 0, z: 0 };
    }
    this.location = location;
  }

  createRaycaster() {
    this.modelRaycaster = new THREE.Raycaster();

    const rayOrigin = new THREE.Vector3(
      location.x,
      location.y + 10,
      location.z
    );
    const rayDirection = new THREE.Vector3(0, -1, 0);
    rayDirection.normalize();

    sphereRaycaster.set(rayOrigin, rayDirection);
    sphereRaycaster.far = 20;
    sphereRaycaster.firstHitOnly = true;
  }
  createHelper() {
    this.helperRay = new THREE.ArrowHelper(
      rayDirection,
      rayOrigin,
      20,
      "orange"
    );
    this.scene.add(this.helperRay);
  }
  update() {}
}
