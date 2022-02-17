import * as THREE from "three";
import Experience from "../../../Experience.js";

export default class Destination {
  constructor(parent, name, position) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.planes = this.experience.world.floors;
    this.physics = this.experience.world.physics;
    this.callback = this.experience.callback;

    this.position = position;
    this.name = name;
    this.size = 6;
    this.parent = parent;

    this.generated = this.generate();
  }

  generate() {
    //Add to floors so shaders can access
    this.index = this.planes.increaseNumberOfDrops();

    //Check that it can be added
    if (this.index === -1) {
      console.log("exceeded max objects, cant add");
      return false;
    }
    //https://discourse.threejs.org/t/how-to-clone-a-model-thats-loaded-with-gltfloader/23723/6
    //Creating Destination
    this.geometry = this.experience.world.testGeo;
    this.material = new THREE.MeshStandardMaterial({
      color: "orange",
    });
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.position.copy(this.position);
    this.instance.name = this.name;

    //Adding Asteroid
    this.scene.add(this.instance);

    //update shader
    // drop amount, k value, the range
    this.info = {
      x: this.size,
      y: 1,
      z: this.size * 2,
    };
    this.planes.updateDropsInfo(this.index, this.info);
    this.planes.updateDrops(this.index, this.instance.position);

    this.setPhysics();
    return true;
  }
  setPhysics() {
    this.physics.generateNewBody(
      this.name,
      "destination",
      {
        x: this.instance.position.x,
        y: this.instance.position.z,
      },
      this.size,
      this.instance,
      (collidedWith) => this.onCollision()
    );
  }

  onCollision() {
    return;
  }

  activate() {
    this.callback(this.name);
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.instance);
    this.planes.removeIndex(this.index);
  }
}
