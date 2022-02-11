import Experience from "../../Experience";
import * as THREE from "three";
import Floor from "./Floor";
import EventEmitter from "../../Utils/EventEmitter";

export default class Floors extends EventEmitter {
  constructor(size = 5, boundary = 2) {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.mouse = this.experience.mouse;

    this.planesArray = [];
    this.planeInfo = {};
    this.planeInfo.size = size;
    this.creationBoundary = boundary;
    this.boundingLength = this.pythagorean(
      this.creationBoundary,
      this.creationBoundary
    );
    this.planeDiagonal = this.pythagorean(
      this.planeInfo.size / 2,
      this.planeInfo.size / 2
    );

    this.createPlane();
  }

  createPlane(location) {
    if (!location) {
      location = { x: 0, y: 0, z: 0 };
    }

    if (this.checkForPreviousPlane(location)) {
      //   console.log("Cancelling!");
      return;
    }
    console.log("creating", location);
    const floor = new Floor(location, this.planeInfo.size, "New Floor");
    floor.setName("floor-" + this.planesArray.length);

    this.planesArray.push(floor);

    this.trigger("createdNewMesh");
  }
  checkForPreviousPlane(location) {
    return (
      this.getFloorsArrayMeshs().filter((n) => n.position.equals(location))
        .length > 0
    );
  }

  //Point: location of sphere
  //planePosition: location of plane where the sphere raycaster is hitting
  updatePlanes(point, planePosition) {
    //Create new this

    let xToggle = false;
    if (
      Math.abs(point.x - planePosition.x) >
      this.planeInfo.size / 2 - this.creationBoundary
    ) {
      // console.log("Clicked point.x: ", isPositive(point.x));
      this.createPlane({
        x:
          planePosition.x +
          this.isPositive(point.x, planePosition.x) * this.planeInfo.size,
        y: planePosition.y,
        z: planePosition.z,
      });
      xToggle = true;
    }
    // console.log(
    //   xToggle,
    //   point.z,
    //   planePosition.z,
    //   this.planeInfo.size / 2 - this.creationBoundary
    // );
    if (
      Math.abs(point.z - planePosition.z) >
      this.planeInfo.size / 2 - this.creationBoundary
    ) {
      // console.log("Clicked point.z: ", isPositive(point.z));
      this.createPlane({
        x: planePosition.x,
        y: planePosition.y,
        z:
          planePosition.z +
          this.isPositive(point.z, planePosition.z) * this.planeInfo.size,
      });
      if (xToggle) {
        this.createPlane({
          x:
            planePosition.x +
            this.isPositive(point.x, planePosition.x) * this.planeInfo.size,
          y: planePosition.y,
          z:
            planePosition.z +
            this.isPositive(point.z, planePosition.z) * this.planeInfo.size,
        });
      }
    }

    // Remove this
    // Iterate over all this, if the distance from the sphere

    this.getFloorsArrayMeshs().forEach((n, i) => {
      let distanceFromSphere = point.clone();

      distanceFromSphere.y = n.position.y;
      const distance = distanceFromSphere.distanceTo(n.position);

      if (distance > this.boundingLength + this.planeDiagonal) {
        console.log("Too far from " + n.name);
        this.scene.remove(n);
        this.planesArray.splice(i, 1);
        return false;
      }
      return true;
    });
  }
  isPositive(num, relative = 0) {
    return num - relative === 0 ? 0 : num - relative > 0 ? 1 : -1;
  }

  pythagorean(sideA, sideB) {
    return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
  }

  getFloorsArrayMeshs() {
    return this.planesArray.map((n) => n.mesh);
  }

  updateClick() {
    this.intersect = this.mouse.intersect(this.getFloorsArrayMeshs());
    if (this.intersect.length) {
      this.point = this.intersect[0].point;
    }
  }
}
