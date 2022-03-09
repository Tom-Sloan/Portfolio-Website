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

    this.loadModels();

    // this.model.scale.set(1.5, 1.5, 1.5);
    this.generated = this.generate();
    this.setAnimation();
  }

  loadModels() {
    //Set to the projects values
    if (this.type === "0") {
      //Get the model for the destination
      this.model = this.resources.items.papersGTLFModel.scene.clone();
      this.model.traverse((child) => {
        //Set the texture of the model
        if (
          child instanceof THREE.Object3D &&
          child.name === "Bunch_of_Papers_C001"
        ) {
          child.material.map = this.resources.items.papersTexture;
          this.resources.items.papersTexture.flipY = false;
        }
      });
      //Scale the model
      this.model.scale.set(60, 3, 60);
      //Get the text of the model
      this.text = this.resources.items.projectsTextGTLFModel.scene.clone();
      this.text.scale.set(3.5, 3.5, 3.5);

      //Set to the resume values
    } else if (this.type === "1") {
      //Get the model for the destination
      this.model = this.resources.items.papersGTLFModel.scene.clone();
      this.model.traverse((child) => {
        //Set the texture of the model
        if (
          child instanceof THREE.Object3D &&
          child.name === "Bunch_of_Papers_C001"
        ) {
          child.material.map = this.resources.items.papersTexture;
          this.resources.items.papersTexture.flipY = false;
        }
      });
      //Scale the model
      this.model.scale.set(60, 3, 60);
      //Get the text of the model
      this.text = this.resources.items.resumeTextGTLFModel.scene.clone();
      this.text.scale.set(3.5, 3.5, 3.5);

      //Set to the contact values
    } else {
      //Get the model for the destination
      this.model = this.resources.items.papersGTLFModel.scene.clone();
      this.model.traverse((child) => {
        //Set the texture of the model
        if (
          child instanceof THREE.Object3D &&
          child.name === "Bunch_of_Papers_C001"
        ) {
          child.material.map = this.resources.items.papersTexture;
          this.resources.items.papersTexture.flipY = false;
        }
      });
      //Scale the model
      this.model.scale.set(60, 3, 60);
      //Get the text of the model
      this.text = this.resources.items.contactTextGTLFModel.scene.clone();
      this.text.scale.set(3.5, 3.5, 3.5);
    }

    this.platformModel = this.resources.items.pedestalGLTFModel.scene.clone();
    this.platformModel.scale.set(0.5, 0.5, 0.5);
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
    this.instance = new THREE.Group();
    //Add Platform
    this.instance.add(this.platformModel);

    //Add model
    this.model.position.set(0, 1, 0);

    this.instance.add(this.model);

    this.instance.add(this.text);

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

  setAnimation() {
    this.instance.traverse((child) => {
      if (child instanceof THREE.Object3D) {
        if (child.name === "Text") {
          this.textObject = child;
          if (this.techPedestalObject) {
            return;
          }
        }
        if (child.name === "tech_pedestal") {
          this.techPedestalObject = child;
          if (this.textObject) {
            return;
          }
        }
      }
    });
    this.platformModel.traverse((child) => {
      if (child instanceof THREE.Object3D) {
        if (child.name === "tech_pedestal") {
          this.techPedestalObject = child;

          return;
        }
      }
    });

    if (this.techPedestalObject) {
      this.techPedestalObjectTextures = [];
      this.addTextures();

      this.techPedestalObjectTextures.forEach((n) => {
        this.techPedestalObject.material[n.key] = n.value;

        if (n.value instanceof THREE.Texture) {
          n.value.flipY = false;
        }
      });
    }
    // // Mixer
    // this.animation.mixer = new THREE.AnimationMixer(this.instance);

    // // // Actions
    // this.animation.actions = {};

    // this.animation.actions.default = this.animation.mixer.clipAction(
    //   this.animations[0]
    // );

    // this.animation.actions.default.play();
  }

  addTextures() {
    this.techPedestalObjectTextures.push({
      key: "transparent",
      value: true,
    });
    this.techPedestalObjectTextures.push({
      key: "opacity",
      value: 1,
    });
    this.techPedestalObjectTextures.push({
      key: "map",
      value: this.resources.items.hoverPlatformColor,
    });
    this.techPedestalObjectTextures.push({
      key: "emissiveMap",
      value: this.resources.items.hoverPlatformEmit,
    });
    this.techPedestalObjectTextures.push({
      key: "emissiveIntensity",
      value: 10,
    });
    this.techPedestalObjectTextures.push({
      key: "metalnessMap",
      value: this.resources.items.hoverPlatformMettalic,
    });
    this.techPedestalObjectTextures.push({
      key: "roughnessMap",
      value: this.resources.items.hoverPlatformRoughness,
    });
  }
  setPhysics() {
    this.physics.generateNewBody(
      this.name,
      "destination",
      {
        x: this.instance.position.x,
        y: this.instance.position.z,
      },
      this.size * 2 - 0.5,
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
    if (this.textObject) {
      this.textObject.rotation.z += 0.01;
    }
  }
  destroy() {
    this.physics.removeBody(this.name);
    this.scene.remove(this.instance);
    this.planes.removeIndex(this.index);
  }
}
