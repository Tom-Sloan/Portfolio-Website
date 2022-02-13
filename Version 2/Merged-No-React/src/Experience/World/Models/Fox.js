import * as THREE from "three";
import Experience from "../../Experience.js";
import gsap from "gsap";
import ModelRaycaster from "./ModelRaycaster.js";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.planes = this.experience.world.floors;
    this.camera = this.experience.camera;

    this.speed = 3;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox");
      this.debugFolder.close();
    }

    // Resource
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();

    this.camera.instance.lookAt(this.model.position);
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    this.raycaster = new ModelRaycaster(this.model.position);
  }
  move(destination) {
    let direction = destination.clone();
    direction.sub(this.model.position);

    // const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(this.model.x, this.model.y, this.model.z);
    // cube.visible = false;
    // this.scene.add(cube);
    // // console.log(cube);
    // // cube.lookAt(destination);
    // // console.log(cube.rotation);
    // // cube.dispose();

    // console.log(destination, this.);
    // console.log(
    //   this.model.position.x,
    //   this.model.position.z,
    //   destination.x,
    //   destination.z
    // );
    // const dotPro =
    //   this.model.position.x * destination.x +
    //   this.model.position.z * destination.z;
    // console.log(dotPro);
    // const magSRT = (a, b) => Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    // const dot =
    //   dotPro /
    //   (magSRT(this.model.position.x, this.model.position.z) *
    //     magSRT(destination.x, destination.z));
    // console.log((Math.acos(dot) * 180) / Math.PI);
    const totalLength = direction.length();

    const timeToRun = totalLength / this.speed;
    this.model.lookAt(direction);
    gsap.to(this.model.position, {
      duration: timeToRun,
      ease: "linear",
      overwrite: "auto",
      x: destination.x,
      z: destination.z,
      onStart: this.startMovement,
      onStartParams: [this],
      onUpdate: this.updateMovement,
      onUpdateParams: [this],
      onComplete: this.completeMovement,
      onCompleteParams: [this],
    });
  }
  startMovement(instance) {
    instance.camera.savePostition(instance.model.position);
    instance.animation.play("running");
  }
  completeMovement(instance) {
    instance.animation.play("idle");
  }
  updateMovement(instance) {
    let elem = this.targets()[0];

    const xVal = gsap.getProperty(elem, "x");
    const zVal = gsap.getProperty(elem, "z");
    //Update Camera
    instance.camera.movePosition({ x: xVal, z: zVal });

    instance.camera.instance.lookAt(instance.model.position);

    //Update Raycaster
    instance.raycaster.update({ x: xVal, z: zVal });

    const intersect = instance.raycaster.intersect(
      instance.planes.getFloorsArrayMeshs()
    );

    if (intersect.length) {
      const planePosition = intersect[0].object.position;
      instance.planes.updatePlanes(instance.model.position, planePosition);
    }
  }

  setAnimation() {
    this.animation = {};

    // Mixer
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    // Actions
    this.animation.actions = {};

    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    // Play the action
    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };

    // Debug
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle");
        },
        playWalking: () => {
          this.animation.play("walking");
        },
        playRunning: () => {
          this.animation.play("running");
        },
      };
      this.debugFolder.add(debugObject, "playIdle");
      this.debugFolder.add(debugObject, "playWalking");
      this.debugFolder.add(debugObject, "playRunning");
    }
  }
  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
