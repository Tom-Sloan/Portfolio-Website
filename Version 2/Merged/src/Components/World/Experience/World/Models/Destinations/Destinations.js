import Experience from "../../../Experience";
import Destination from "./Destination";
import * as THREE from "three";

export default class Destinations {
  constructor(parent, floorName, size) {
    this.experience = new Experience();
    this.planes = this.experience.world.floors;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.sizes = this.experience.sizes;

    this.floorName = floorName;
    this.size = size;
    this.distFromEdge = 8;
    this.distanceBetweenDestinations = 30;

    this.labels = [
      { label: "Projectasdfasdfsadf", description: "asdfasdfasdfsadf" },
      { label: "Project", description: "asdfasdfasdfsadf" },
      { label: "Project", description: "asdfasdfasdfsadf" },
    ];
    this.destinations = [];
    this.parent = parent;
    this.offset = parent.position;

    this.time.timeToRun(
      () => this.createDestinations(),
      "to create destinations "
    );
  }

  createDestinations() {
    for (let i = 0; i < this.labels.length; i++) {
      //get position of the new element
      const position = this.getPosition();

      const name = this.floorName + "-destination-" + i;
      // create the three.js element
      const destination = new Destination(this.parent, name, position);

      // check for destination generated in three.js
      if (destination.generated) {
        this.destinations.push({ destination, position, name });
      }
    }
  }
  randomInt(max, min) {
    return Math.round(Math.random() * (max - min)) + min;
  }
  oneOrMinueOne() {
    return Math.round(Math.random()) === 0 ? 1 : -1;
  }
  getPosition() {
    let position = null;
    let generating = true;

    while (generating) {
      position = new THREE.Vector3(
        this.randomInt(this.size / 2 - this.distFromEdge, 8) *
          this.oneOrMinueOne() +
          this.offset.x,
        0,
        this.randomInt(this.size / 2 - this.distFromEdge, 8) *
          this.oneOrMinueOne() +
          this.offset.z
      );
      const tooClose = this.destinations.filter(
        (n) =>
          this.distanceTo(position, n.position) <
          this.distanceBetweenDestinations
      );

      if (!tooClose.length) {
        generating = false;
      }
    }
    return position;
  }
  distanceTo(point, point2) {
    return Math.sqrt(
      Math.pow(point.x - point2.x, 2) + Math.pow(point.z - point2.z, 2)
    );
  }

  getMeshes() {
    return this.destinations.map((n) => n.destination.instance);
  }
  getDestinationByName(name) {
    return this.destinations.filter((n) => n.name === name);
  }
  activateByName(name) {
    const destination = this.getDestinationByName(name);
    destination[0].destination.activate();
  }
  p;

  //was used for the dom elements
  update() {}

  destroy() {
    this.destinations.forEach((n) => {
      n.destination.destroy();
    });

    this.destinations = [];
  }
}
