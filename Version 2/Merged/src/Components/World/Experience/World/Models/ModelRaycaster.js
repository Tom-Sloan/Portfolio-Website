import * as THREE from "three";
import Experience from "../../Experience";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

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

    this.createRaycaster();

    if (this.debug.active) this.createHelper();
  }

  createRaycaster() {
    this.instance = new THREE.Raycaster();

    this.rayOrigin = new THREE.Vector3(
      this.location.x,
      this.location.y + 10,
      this.location.z
    );
    this.rayDirection = new THREE.Vector3(0, -1, 0);
    this.rayDirection.normalize();

    this.instance.set(this.rayOrigin, this.rayDirection);
    this.instance.far = 20;
    this.instance.firstHitOnly = true;
  }
  createHelper() {
    this.helperRay = new THREE.ArrowHelper(
      this.rayDirection,
      this.rayOrigin,
      20,
      "orange"
    );
    this.scene.add(this.helperRay);
  }

  intersect(object) {
    const intersect = this.instance.intersectObjects(object);
    return intersect;
  }

  update(location) {
    const xVal = location.x;
    const zVal = location.z;
    this.instance.ray.origin.setX(xVal);
    this.instance.ray.origin.setZ(zVal);
    if (this.debug.active) {
      this.helperRay.position.setX(xVal);
      this.helperRay.position.setZ(zVal);
    }
  }
}
