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

    this.labels = [
      { label: "Project", description: "asdfasdfasdfsadf" },
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
      const position = new THREE.Vector3(
        Math.random() * this.size - this.size / 2 + this.offset.x,
        0,
        Math.random() * this.size - this.size / 2 + this.offset.z
      );
      // create the three.js element
      const destination = new Destination(
        this.parent,
        this.floorName + "-destination-" + i,
        position
      );

      // check for destination generated in three.js
      if (destination.generated) {
        //create the dom element
        const labelDiv = document.createElement("div");
        labelDiv.classList.add("hoverlabel");

        const labelText = document.createTextNode(i + 1);
        labelDiv.appendChild(labelText);

        const contentDiv = document.createElement("div");
        contentDiv.classList.add("text");

        const contentText = document.createTextNode(this.labels[i].description);
        contentDiv.appendChild(contentText);

        const element = document.createElement("div");
        element.classList.add("point");
        element.classList.add("visible");
        element.appendChild(labelDiv);
        element.appendChild(contentDiv);

        document.body.appendChild(element);
        this.destinations.push({ destination, element, position });
      }
    }
  }

  getMeshes() {
    return this.destinations.map((n) => n.destination.instance);
  }
  getDestinationByName(name) {
    return this.destinations.filter((n) => n.name === name);
  }
  activateByName(name) {
    const destination =this.getDestinationByName(name)
  }

  update() {
    for (const point of this.destinations) {
      const screenPosition = point.position.clone();
      screenPosition.project(this.camera.instance);

      this.camera.updateRaycaster(screenPosition);

      const translateX = screenPosition.x * this.sizes.width * 0.5;
      const translateY = -screenPosition.y * this.sizes.height * 0.5;
      if (point.element)
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
    }
  }

  destroy() {
    this.destinations.forEach((n) => {
      n.destination.destroy();
      n.element.remove();
    });

    this.destinations = [];
  }
}
