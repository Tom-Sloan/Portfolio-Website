import * as THREE from "three";
import Experience from "../../Experience.js";
import gsap from "gsap";
import ModelRaycaster from "./ModelRaycaster.js";
import { Vector2 } from "three";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.planes = this.experience.world.floors;
    this.camera = this.experience.camera;
    this.physics = this.experience.world.physics;
    this.name = "model";

    this.speed = 12;
    this.collisionDistance = 2;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox");
      this.debugFolder.close();
      this.setDebug();
    }

    // Resource
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setPhysics();
    this.setAnimation();

    this.camera.instance.lookAt(this.model.position);
  }
  setDebug() {
    this.debugFolder.add(this, "speed").min(1).max(20).step(0.1);
  }

  setCube() {
    this.geometry = new THREE.BoxGeometry(3, 3, 3);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);
  }

  setPhysics() {
    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     const box = new THREE.Box3().setFromBufferAttribute(
    //       child.geometry.attributes.position
    //     );
    //     const temp = new THREE.Vector3(0, 0, 0);
    //     console.log(box.min, box.max, box.getSize(temp));
    //     // console.log(); https://stackoverflow.com/questions/23859512/how-to-get-the-width-height-length-of-a-mesh-in-three-js
    //   }
    // });

    this.physics.generateNewBody(
      this.name,
      "user",
      {
        x: this.model.position.x,
        y: this.model.position.z,
      },
      1.25,
      this.model,
      (collidedWith) => this.onCollision(collidedWith)
    );
  }

  setModel() {
    //Add to floors so shaders can access
    this.index = this.planes.increaseNumberOfDrops();

    if (this.index === -1) {
      console.log("exceeded max objects, cant add");
      return;
    }
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    // this.model.traverse((child) => {
    //   if (child instanceof THREE.Mesh) {
    //     child.castShadow = true;
    //   }
    // });

    this.raycaster = new ModelRaycaster(this.model.position);

    //Add inital drop
    //update shader
    // drop amount, k value, the range
    this.info = {
      x: 0.2 + 1.25 * 2,
      y: 1,
      z: 1.25 * 5,
    };
    this.planes.updateDropsInfo(this.index, this.info);
    this.planes.updatePlanes(this.index, this.model.position, {
      x: 0,
      y: 0,
      z: 0,
    });

    // if (this.debug.active) this.createHelper();
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

    const point2 = new Vector2(this.model.position.x, this.model.position.z);
    if (this.model.position.x === 0 && this.model.position.z === 0) {
      point2.y = 10;
    }
    const point1 = new Vector2(0, 0);
    const point4 = new Vector2(destination.x, destination.z);
    const point3 = new Vector2(0, 0);
    const p12x = point2.x - point1.x;
    const p12y = point2.y - point1.y;
    const p34x = point4.x - point3.x;
    const p34y = point4.y - point3.y;
    // console.log(p12x, p12y, p34x, p34y);
    const angle = Math.acos(
      (p12x * p34x + p12y * p34y) /
        (Math.sqrt(Math.pow(p12x, 2) + Math.pow(p12y, 2)) *
          Math.sqrt(Math.pow(p34x, 2) + Math.pow(p34y, 2)))
    );
    // console.log((angle * 180) / Math.PI);

    const totalLength = direction.length();

    const timeToRun = totalLength / this.speed;
    // this.model.lookAt(direction);
    gsap.to(this.model.position, {
      duration: timeToRun,
      ease: "linear",
      overwrite: "auto",
      x: destination.x,
      z: destination.z,
      onStart: this.startMovement,
      onStartParams: [this, angle],
      onUpdate: this.updateMovement,
      onUpdateParams: [this],
      onComplete: this.completeMovement,
      onCompleteParams: [this],
    });
  }
  startMovement(instance, angle) {
    instance.camera.savePostition(instance.model.position);
    instance.animation.play("running");
    if (instance.helperRay) {
      instance.updateHelper(instance.model.position, angle);
    }
  }
  completeMovement(instance) {
    instance.animation.play("idle");
  }
  updateMovement(instance) {
    // get the important values
    let elem = this.targets()[0];
    const xVal = gsap.getProperty(elem, "x");
    const zVal = gsap.getProperty(elem, "z");

    //Update Camera
    instance.camera.movePosition({ x: xVal, z: zVal });
    instance.camera.instance.lookAt(instance.model.position);

    //Update Raycaster
    instance.raycaster.update({ x: xVal, z: zVal });

    // instance.cube.position.copy(instance.model.position);
    //update Physics
    instance.physics.updatePosition(instance.name, instance.model.position);

    // check for intersection with the planes
    const intersect = instance.raycaster.intersect(
      instance.planes.getFloorsArrayMeshs()
    );

    // I don't think I acctually need a ray caster for this, because I am really just sending the xz coords of the model.
    // I can probably just calculate which plane the fox is on and do the math using that. This is easier tho
    if (intersect.length) {
      const planePosition = intersect[0].object.position;
      instance.planes.updatePlanes(
        instance.index,
        instance.model.position,
        planePosition
      );
    }
  }

  createHelper() {
    this.helperRay = new THREE.ArrowHelper(
      this.rayDirection,
      this.rayOrigin,
      5,
      "purple"
    );
    this.scene.add(this.helperRay);
  }
  updateHelper(position, angle) {
    this.helperRay.position.set(position.x, position.y, position.z);
    this.helperRay.rotateZ(angle);
    // console.log(this.model.rotation.y);
    this.model.rotateY(angle - this.model.rotation.y);
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

  onCollision(collidedWith) {
    // console.log(this.model, collidedWith);
    // console.log(this.name + " exploded");
    let direction = collidedWith.mesh.position.clone();
    //get the vector to the model we are colliding with
    direction.sub(this.model.position);
    // get opposite direction to collision
    direction.normalize();
    direction.multiplyScalar(-1.0 * this.collisionDistance);

    gsap.to(this.model.position, {
      overwrite: "auto",
      duration: 2.6,
      ease: "power2",
      x: this.model.position.x + direction.x,
      z: this.model.position.z + direction.z,
      onUpdate: this.updateMovement,
      onUpdateParams: [this],
      onComplete: this.completeMovement,
      onCompleteParams: [this],
    });
    gsap.to(this.model.position, {
      overwrite: "auto",
      duration: 0.1,
      ease: "linear",
      y: 8,
    });
    gsap.to(this.model.position, {
      overwrite: "auto",
      duration: 2.5,
      ease: "elastic.out(5, 0.2)",
      y: 0,
    });
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
