import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floors from "./Floors/Floors.js";
import Fox from "./Models/Fox.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floors = new Floors(100, 20);
      this.fox = new Fox();
      this.environment = new Environment();

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
  }
}
