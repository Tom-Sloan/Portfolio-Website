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
    this.destinations = this.experience.destinations;

    this.floorName = floorName;
    this.size = size;
    this.distFromEdge = 50;
    this.distanceBetweenDestinations = 20;

    this.destinationsArray = [];
    this.parent = parent;
    this.offset = parent.position;

    this.time.timeToRun(
      () => this.createDestinations(),
      "to create destinationsArray "
    );
  }

  createDestinations() {
    for (let i = 0; i < this.destinations.length; i++) {
      //get position of the new element
      const position = this.getPosition();

      const name =
        this.floorName + "-destination-" + this.destinations[i].index;
      // create the three.js element
      const destination = new Destination(this.parent, name, position);

      // check for destination generated in three.js
      if (destination.generated) {
        // //create the dom element
        // const labelDiv = document.createElement("div");
        // labelDiv.classList.add("hoverlabel");

        // const labelText = document.createTextNode(i + 1);
        // labelDiv.appendChild(labelText);

        // const contentDiv = document.createElement("div");
        // contentDiv.classList.add("text");

        // const contentText = document.createTextNode(this.labels[i].description);
        // contentDiv.appendChild(contentText);

        // const element = document.createElement("div");
        // element.classList.add("point");
        // element.classList.add("visible");
        // element.appendChild(labelDiv);
        // element.appendChild(contentDiv);

        // document.body.appendChild(element);
        this.destinationsArray.push({
          destination,
          position,
          name,
          type: this.destinations[i].index,
        });
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
      const tooClose = this.destinationsArray.filter(
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
    return this.destinationsArray.map((n) => n.destination.instance);
  }
  getDestinationByType(type) {
    return this.destinationsArray.filter((n) => n.type === type);
  }
  activateByName(name) {
    const type = parseInt(name.charAt(name.length - 1));
    const destination = this.getDestinationByType(type);
    destination[0].destination.activate();
  }

  //was used for the dom elements
  update() {
    this.destinationsArray.forEach((n) => n.destination.update());
  }

  destroy() {
    this.destinationsArray.forEach((n) => {
      n.destination.destroy();
      if (n.element) {
        n.element.remove();
      }
    });

    this.destinationsArray = [];
  }
}
