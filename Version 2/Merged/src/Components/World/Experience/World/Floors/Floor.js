import * as THREE from "three";
import Experience from "../../Experience.js";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export default class Floor {
  constructor(location, size = 10, name = "DefaultFloorName") {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    if (!location) {
      location = { x: 0, y: 0, z: 0 };
    }
    this.location = location;
    this.size = size;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(this.size, this.size);
    this.geometry.computeBoundsTree({ lazyGeneration: false });
  }

  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.encoding = THREE.sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }

  setPosition(location) {
    this.mesh.position.set(location.x, location.y, location.z);
  }
  setName(name) {
    this.mesh.name = name;
  }
}
