import * as THREE from "three";
import Experience from "../../../Experience.js";
import ModelRaycaster from "../ModelRaycaster.js";

export default class Asteroid {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.planes = this.experience.world.floors;
    this.asteroidTextures = [];

    this.addTextures();
    this.generated = this.generate();
  }

  addTextures() {
    this.asteroidTextures.push({
      key: "transparent",
      value: true,
    });
    this.asteroidTextures.push({
      key: "opacity",
      value: 1,
    });
    this.asteroidTextures.push({
      key: "map",
      value: this.resources.items.asteroidBasecolorTexture,
    });
    this.asteroidTextures.push({
      key: "displacementScale",
      value: 0.7,
    });
    this.asteroidTextures.push({
      key: "displacementMap",
      value: this.resources.items.asteroidHeightTexture,
    });
    this.asteroidTextures.push({
      key: "normalMap",
      value: this.resources.items.asteroidNormalTexture,
    });
    this.asteroidTextures.push({
      key: "aoMap",
      value: this.resources.items.asteroidAOTexture,
    });
    this.asteroidTextures.push({
      key: "aoMapIntensity",
      value: 1,
    });
    this.asteroidTextures.push({
      key: "roughnessMap",
      value: this.resources.items.asteroidRoughnessTexture,
    });
  }

  generate() {
    //Add to floors so shaders can access
    this.index = this.planes.increaseNumberOfDrops();

    //Check that it can be added
    if (this.index === -1) {
      console.log("exceeded max objects, cant add");
      return false;
    }
    //Creating asteroid
    this.radius = Math.max(Math.random(), 0.25) * 5;
    this.geometry = new THREE.SphereGeometry(1, 512, 512);
    this.material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.scale.x = this.radius;
    this.instance.scale.y = this.radius;
    this.instance.scale.z = this.radius;

    //this.instance Params
    this.instance.castShadow = true;
    this.instance.receiveShadow = true;
    this.instance.position.set(
      10 * (Math.random() - 0.5),
      0.5 + this.radius,
      0
    );
    this.asteroidTextures.forEach(
      (n) => (this.instance.material[n.key] = n.value)
    );

    //Adding Asteroid
    this.scene.add(this.instance);

    //update shader
    // drop amount, k value, the range
    this.info = {
      x: 0.2 + this.radius * 2,
      y: 1,
      z: this.radius * 5,
    };
    this.planes.updateDropsInfo(this.index, this.info);
    this.planes.updateDrops(this.index, this.instance.position);
    return true;
  }

  updatePosition(location) {
    this.instance.position.set(location.x, location.y, location.z);
    this.planes.updateDrops(this.index, this.instance.position);
  }

  destroy() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.instance);
    this.planes.removeIndex(this.index);
  }
}
