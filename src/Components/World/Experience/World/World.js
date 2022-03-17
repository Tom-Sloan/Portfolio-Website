import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floors from "./Floors/Floors.js";
import Asteroids from "./Models/Asteroids/Asteroids.js";
import Background from "./Models/Background/Background.js";
import Fox from "./Models/Fox.js";
import Physics from "./Physics.js";
import * as THREE from "three";
import RotationPractise from "./Models/RotationPractise.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup

      //This is first since everything else will be added to it
      this.physics = new Physics();

      //Floors second since everything else is dependant on floor size for scaling
      this.floors = new Floors();
      this.floors.createPlane();

      //Third since asteroids use the position to determine how far away to spawn
      this.fox = new Fox();

      // the exact placement is optional, however these must be after the above
      this.environment = new Environment();
      this.asteroids = new Asteroids(5);
      // this.rotationPractise = new RotationPractise();
      // this.background = new Background();

      this.floors.on("createdNewMesh", () => this.newMeshCreated());
      this.experience.isReady = true;
      this.experience.callback();
    });
  }

  newMeshCreated() {
    this.environment.updateEnviromentMap();
  }
  updateClick() {
    // check if it intercets with a floor
    this.floors.updateClick();
    if (this.floors.floorClick) {
      this.fox.move(this.floors.point);
      this.floors.floorClick = false;
    }
    // this.rotationPractise.update();
  }

  update() {
    if (this.floors) this.floors.update();
    if (this.fox) this.fox.update();
    if (this.asteroids) this.asteroids.update();
    if (this.background) this.background.update();
    if (this.physics) this.physics.update();
  }

  resize() {
    if (this.physics) this.physics.resize();
  }
}