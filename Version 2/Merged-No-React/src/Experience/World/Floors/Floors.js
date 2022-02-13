import Experience from "../../Experience";
import Floor from "./Floor";
import EventEmitter from "../../Utils/EventEmitter";

export default class Floors extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene; // used so i can delete the floors
    this.mouse = this.experience.mouse; // used to set up a mouse listener
    this.debug = this.experience.debug;

    this.planesArray = []; // contains all the planes
    this.planeInfo = {}; // contains the information of the planes

    //the defaults
    this.planeInfo.size = 100; // the width
    this.planeInfo.creationBoundary = 20; // how farfrom the edge you must be before a new grid is created
    this.planeInfo.gridDensity = 30.0; // percent of the grid with lines

    this.setLengths();

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Floors");
      this.debugFolder.close();
      this.setDebug();
    }

    this.createPlane();
  }

  setLengths() {
    this.planeInfo.boundingLength = this.pythagorean(
      this.planeInfo.creationBoundary,
      this.planeInfo.creationBoundary
    );
    this.planeInfo.planeDiagonal = this.pythagorean(
      this.planeInfo.size / 2,
      this.planeInfo.size / 2
    );
  }

  createPlane(location) {
    if (!location) {
      location = { x: 0, y: 0, z: 0 };
    }

    if (this.checkForPreviousPlane(location)) {
      //   console.log("Cancelling!");
      return;
    }

    const floor = new Floor({
      location: location,
      size: this.planeInfo.size,
      name: "New Floor",
      gridDensity: this.gridDensity,
    });
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
      this.planeInfo.size / 2 - this.planeInfo.creationBoundary
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
    //   this.planeInfo.size / 2 - this.planeInfo.creationBoundary
    // );
    if (
      Math.abs(point.z - planePosition.z) >
      this.planeInfo.size / 2 - this.planeInfo.creationBoundary
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

      if (
        distance >
        this.planeInfo.boundingLength + this.planeInfo.planeDiagonal
      ) {
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
  changeSize(size, boundary) {
    if (boundary === null) boundary = this.boundary;

    if (size < boundary) {
      boundary = size * 0.2;
    }

    // this.planesArray.forEach;
  }
  setDebug() {
    const params = {};

    params.changeSize = () => {
      this.setLengths();
      this.planesArray.forEach((n) => n.setSize(this.planeInfo.size));
    };

    params.changeGridDensity = () =>
      this.planesArray.forEach((n) =>
        n.setGridDensity(this.planeInfo.gridDensity)
      );

    this.debugFolder
      .add(this.planeInfo, "size")
      .min(1)
      .max(150)
      .step(1)
      .onFinishChange(params.changeSize);

    this.debugFolder
      .add(this.planeInfo, "gridDensity")
      .min(1.0)
      .max(100.0)
      .step(0.05)
      .onChange(params.changeGridDensity);
  }
  // createDebug() {

  //   const params = {

  //   }
  //   this.debugFolder
  //     .add(gridMaterial.uniforms.uGridDensity, "value")
  //     .min(0)
  //     .max(100)
  //     .step(1)
  //     .name("uGridDensity");
  // }
  // updatePlanesAttribute(attribute, value) {
  //   this.planesArray.forEach((n) => helper(n, attribute, value));

  //   const helper = (n, attribute, value) => {
  //     if (attribute === "gridDensity") {
  //       n.setGridDensity(value);
  //     }
  //     if (attribute === "dropLocation") {
  //       n.setGridDensity(value);
  //     }
  //     if (attribute === "gridDensity") {
  //       n.setGridDensity(value);
  //     }
  //   };
  // }
}
