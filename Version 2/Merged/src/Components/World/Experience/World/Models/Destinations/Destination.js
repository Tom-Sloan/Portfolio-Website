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
    this.time = this.experience.time;

    this.position = position;
    this.name = name;

    this.size = 6;
    this.type = this.name.charAt(this.name.length - 1);
    this.parent = parent;

    if (this.type === "0") {
      this.animations = this.resources.items.resumeGLTFModel.animations;
      this.model = this.resources.items.resumeGLTFModel.scene.clone();
    } else if (this.type === "1") {
      this.animations = this.resources.items.resumeGLTFModel.animations;
      this.model = this.resources.items.resumeGLTFModel.scene.clone();
    } else {
      this.animations = this.resources.items.resumeGLTFModel.animations;
      this.model = this.resources.items.contactGLTFModel.scene.clone();
    }

    this.model.scale.set(1.5, 1.5, 1.5);
    this.generated = this.generate();
    this.setAnimation();
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
    this.instance = this.model;
    // const colorList = [
    //   new THREE.Color("blue"),
    //   new THREE.Color("orange"),
    //   new THREE.Color("brown"),
    //   new THREE.Color("purple"),
    //   new THREE.Color("red"),
    //   new THREE.Color("green"),
    // ];
    // this.geometry = this.experience.world.testGeo;
    // this.material = new THREE.MeshBasicMaterial({
    //   color: colorList[this.name.charAt(this.name.length - 1)],
    // });
    // this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.position.copy(this.position);
    this.instance.name = this.name;

    //Adding Asteroid
    // this.parent.add(this.instance);
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

  setAnimation() {
    this.animation = {};

    // // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.instance);

    // // Actions
    this.animation.actions = {};

    this.animation.actions.default = this.animation.mixer.clipAction(
      this.animations[0]
    );

    this.animation.actions.default.play();
    // this.animation.actions.walking = this.animation.mixer.clipAction(
    //   this.resource.animations[1]
    // );
    // this.animation.actions.running = this.animation.mixer.clipAction(
    //   this.resource.animations[2]
    // );

    // this.animation.actions.current = this.animation.actions.idle;
    // this.animation.actions.current.play();

    // // Play the action
    // this.animation.play = (name) => {
    //   const newAction = this.animation.actions[name];
    //   const oldAction = this.animation.actions.current;

    //   newAction.reset();
    //   newAction.play();
    //   newAction.crossFadeFrom(oldAction, 1);

    //   this.animation.actions.current = newAction;
    // };
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
    const message = {
      type: "pageView",
      index: this.name.charAt(this.name.length - 1),
    };
    this.callback(message);
  }
  update() {
    //1.
    this.animation.mixer.update(this.time.delta * 0.001);
  }
  destroy() {
    this.physics.removeBody(this.name);
    this.scene.remove(this.instance);
    this.planes.removeIndex(this.index);
  }
}
