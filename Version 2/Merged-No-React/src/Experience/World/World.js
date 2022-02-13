import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floors from "./Floors/Floors.js";
import Asteroids from "./Models/Asteroids/Asteroids.js";
import Background from "./Models/Background/Background.js";
import Fox from "./Models/Fox.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floors = new Floors();
      this.fox = new Fox();
      this.environment = new Environment();
      this.asteroids = new Asteroids(5);
      this.background = new Background();

      this.floors.on("createdNewMesh", () => this.newMeshCreated());
    });
  }

  newMeshCreated() {
    this.environment.updateEnviromentMap();
  }
  updateClick() {
    this.floors.updateClick();
    if (this.floors.intersect.length) {
      this.fox.move(this.floors.point);
    }
  }

  update() {
    if (this.fox) this.fox.update();
    if (this.asteroids) this.asteroids.update();
    if (this.background) this.background.update();
  }
}
