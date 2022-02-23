import * as THREE from "three";
import Experience from "../../Experience.js";
import gsap from "gsap";
import ModelRaycaster from "./ModelRaycaster.js";
import { Vector2 } from "three";
import RotationPractise from "./RotationPractise.js";

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
    this.destinations = this.experience.destinations;
    this.callback = this.experience.callback;

    this.name = "model";
    this.yRot = 0;
    this.speed = 30;
    this.collisionDistance = 2;
    this.sphericals = new Array(this.destinations.length).fill(
      new THREE.Spherical()
    );

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

    this.rotationController = new RotationPractise(this.model.position);
    //get angles of nearest destinations
    this.updateCompass();
  }
  setDebug() {
    this.debugFolder.add(this, "speed").min(1).max(20).step(0.1);
  }

  setPhysics() {
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
  //Move controls two animations
  // 1. the rotation animation
  // 2. the location animation
  move(destination) {
    //
    // const point2 = new Vector2(this.model.position.x, this.model.position.z);
    // if (this.model.position.x === 0 && this.model.position.z === 0) {
    //   point2.y = 10;
    // }
    // const point1 = new Vector2(0, 0);
    // const point4 = new Vector2(destination.x, destination.z);
    // const point3 = new Vector2(0, 0);
    // const p12x = point2.x - point1.x;
    // const p12y = point2.y - point1.y;
    // const p34x = point4.x - point3.x;
    // const p34y = point4.y - point3.y;
    // // console.log(p12x, p12y, p34x, p34y);
    // const angle = Math.acos(
    //   (p12x * p34x + p12y * p34y) /
    //     (Math.sqrt(Math.pow(p12x, 2) + Math.pow(p12y, 2)) *
    //       Math.sqrt(Math.pow(p34x, 2) + Math.pow(p34y, 2)))
    // );
    // console.log((angle * 180) / Math.PI);
    let direction = destination.clone();
    direction.sub(this.model.position);
    //Location animation
    const totalLength = direction.length();

    const timeToRun = totalLength / this.speed;

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
    //rotation animation
    //Get amount to rotate
    this.rotationStartMovement(destination);
    const rotationTime = 0.5;
    //rotate
    gsap.to(this.model.rotation, {
      duration: rotationTime,
      ease: "linear",
      overwrite: "auto",
      y: this.yRot,
      onUpdate: this.rotationUpdateMovement,
      onUpdateParams: [this],
    });
  }

  rotationStartMovement(destination) {
    this.rotationController.offset = 0;
    this.yRot = this.rotationController.getYRot(destination);
    this.rotationController.offset = this.yRot;
  }
  rotationUpdateMovement(instance) {
    let elem = this.targets()[0];
    const yVal = gsap.getProperty(elem, "y");

    instance.rotationController.offset = yVal;
    instance.updateCompass();
  }

  startMovement(instance) {
    instance.camera.savePostition(instance.model.position);
    instance.animation.play("running");
  }
  completeMovement(instance) {
    instance.animation.play("idle");
  }

  getCurrentFloor() {
    const floors = this.planes.getFloorsArrayMeshs();
    const floor = this.raycaster.intersect(floors);

    return floor[0].object;
  }
  updateMovement(instance) {
    // get the important values
    let elem = this.targets()[0];
    const xVal = gsap.getProperty(elem, "x");
    const zVal = gsap.getProperty(elem, "z");

    //Update Camera
    instance.camera.movePosition({ x: xVal, z: zVal });

    //Update Raycaster
    instance.raycaster.update({ x: xVal, z: zVal });

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

    //update Rotation mechanism
    instance.rotationController.setPosition(instance.model.position);
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
    // gsap.to(this.model.position, {
    //   overwrite: "auto",
    //   duration: 0.1,
    //   ease: "linear",
    //   y: 8,
    // });
    // gsap.to(this.model.position, {
    //   overwrite: "auto",
    //   duration: 2.5,
    //   ease: "elastic.out(5, 0.2)",
    //   y: 0,
    // });
  }

  // Teleportation function of the player
  movePlayerToLocation(destinationType) {
    const destination = this.planes.getAllDestinations();

    const nearest = this.planes.getNearestOfType(
      destination,
      this.model.position
    );

    const dest = nearest.filter((n) => n.type === destinationType);

    if (dest.length) {
      const location = dest[0].position.clone();
      location.x = location.x + 7;
      location.z = location.z + 7;
      this.updatePosition(location);
    } else {
      console.log("Invalid Teleport location");
    }
    //For the compass updating
    //update Rotation mechanism
    this.rotationController.setPosition(this.model.position);

    //get angles of nearest destinations
    this.updateCompass();
  }

  //Update Compass
  // this works by getting the closest destinations of each type
  // setting their location to the array of sphericals (so we have access to their attributes)
  // setting the callback to have the proper type and return the array with the values
  // the percent parameter gives the percent of the way from the starting position to the final position the value should be
  updateCompass() {
    const destination = this.planes.getAllDestinations();

    const nearest = this.planes.getNearestOfType(
      destination,
      this.model.position
    );

    const message = {
      type: "compassUpdate",
      data: nearest.map((n) => ({
        index: n.type,
        angle: this.rotationController.getYRot(n.position),
      })),
    };
    this.callback(message);
  }

  getDistanceToPlayer(point) {
    return Math.sqrt(
      Math.pow(this.model.position.x - point.x, 2) +
        Math.pow(this.model.position.z - point.z, 2)
    );
  }
  updatePosition(location) {
    //move model
    this.model.position.setX(location.x);
    this.model.position.setZ(location.z);

    //Update Camera
    this.camera.movePosition({
      x: this.model.position.x,
      z: this.model.position.z,
    });
    this.camera.instance.lookAt(this.model.position);

    //Update Raycaster
    this.raycaster.update({
      x: this.model.position.x,
      z: this.model.position.z,
    });

    //update Physics
    this.physics.updatePosition(this.name, this.model.position);

    // check for intersection with the planes
    const intersect = this.raycaster.intersect(
      this.planes.getFloorsArrayMeshs()
    );

    // I don't think I acctually need a ray caster for this, because I am really just sending the xz coords of the model.
    // I can probably just calculate which plane the fox is on and do the math using that. This is easier tho
    if (intersect.length) {
      const planePosition = intersect[0].object.position;
      this.planes.updatePlanes(this.index, this.model.position, planePosition);
    }
  }
  //Parts of Update:
  // 1. update animation
  // 2. update compass
  // 3. check for teleport
  update() {
    //1.
    this.animation.mixer.update(this.time.delta * 0.001);
    //2.
    // this.updateCompass();
    //3.
    if (window.tomsloanTeleportation !== -1) {
      console.log("Val: ", window.tomsloanTeleportation);
      this.movePlayerToLocation(window.tomsloanTeleportation);
      window.tomsloanTeleportation = -1;
    }
  }
}
