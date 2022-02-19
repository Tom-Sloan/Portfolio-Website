import Experience from "../../Experience";
import Floor from "./Floor";
import EventEmitter from "../../Utils/EventEmitter";
import * as THREE from "three";

export default class Floors extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene; // used so i can delete the floors
    this.mouse = this.experience.mouse; // used to set up a mouse listener
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.planesArray = []; // contains all the planes
    this.planeInfo = {}; // contains the information of the planes

    //the defaults
    this.planeInfo.size = 90; // the width
    this.planeInfo.geometry = this.setGeometry();
    this.planeInfo.creationBoundary = 30; // how farfrom the edge you must be before a new grid is created
    this.planeInfo.gridDensity = 40.0; // percent of the grid with lines
    this.planeInfo.gridType = 0;
    this.planeInfo.depthColor = "#2b36f7";
    this.planeInfo.surfaceColor = "#057dc7";
    this.planeInfo.numberOfDrops = 0.0;
    this.planeInfo.dropLocation = [
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
    ];
    // drop amount, k value, the range
    this.planeInfo.dropInformation = [
      new THREE.Vector3(3, 0.5, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(3, 0.5, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(3, 0.5, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(3, 0.5, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(3, 0.5, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
    ];
    this.planeInfo.count = 0;
    this.planeInfo.colorOffset = 0.08;
    this.planeInfo.colorMultiplier = 5;
    this.planeInfo.opacityMultiplier = 0.5;

    this.planeInfo.maxDrops = this.planeInfo.dropLocation.length;
    this.planeInfo.releasedIndexes = [];

    this.setLengths();

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Floors");
      this.debugFolder.close();
      this.setDebug();
    }
  }
  setGeometry() {
    let geometry = null;

    //make the geometry
    geometry = new THREE.PlaneGeometry(1, 1, 512, 512);
    //For fast ray tracing
    geometry.computeBoundsTree({ lazyGeneration: false });

    return geometry;
  }

  createPlane(location) {
    if (!location) {
      location = { x: 0, y: 0, z: 0 };
    }

    if (this.checkForPreviousPlane(location)) {
      // console.log("Cancelling!");
      return;
    }
    console.log("creating: " + "floor-" + this.planeInfo.count);

    const floor = new Floor({
      ...this.planeInfo,
      name: "floor-" + this.planeInfo.count,
      location: location,
    });

    floor.material.uniforms.uNumberOfDrops.value = this.planeInfo.numberOfDrops;
    floor.setName("floor-" + this.planesArray.length);

    this.planesArray.push(floor);

    this.trigger("createdNewMesh");
    this.planeInfo.count++;
  }

  checkForPreviousPlane(location) {
    return (
      this.getFloorsArrayMeshs().filter((n) => n.position.equals(location))
        .length > 0
    );
  }

  // compares two points and returns 1 if the object point is greater than the plane positions and -1 otherwise
  isPositive(num, relative) {
    return num - relative > 0 ? 1 : -1;
  }

  // given a and b gets c
  pythagorean(sideA, sideB) {
    return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
  }

  getFloorsArrayMeshs() {
    return this.planesArray.map((n) => n.mesh);
  }
  getFloorByName(name) {
    return this.planesArray.filter((n) => n.name === name);
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

  increaseNumberOfDrops() {
    if (this.planeInfo.releasedIndexes.length)
      return this.planeInfo.releasedIndexes.pop();
    if (this.planeInfo.numberOfDrops === this.planeInfo.maxDrops) return -1;

    const index = this.planeInfo.numberOfDrops;
    this.planeInfo.numberOfDrops++;
    this.planesArray.forEach((n) => n.increaseNumberOfDrops());

    return index;
  }

  removeIndex(index) {
    this.updateDropsInfo(index, { x: 0, y: 0, z: 0 });
    this.planeInfo.releasedIndexes.push(index);
  }
  movePlayerToLocation() {
    if (!this.player) this.player = this.experience.world.fox;
    console.log(this.player.getCurrentFloor());
    const floor = this.player.getCurrentFloor();
    if (floor) {
      const dest =
        this.getFloorByName(floor.name)[0].destinations.destinations[
          window.tomsloanTeleportation
        ] || false;
      if (dest) {
        const location = dest.position.clone();
        location.x = location.x + 7;
        location.z = location.z + 7;
        this.player.updatePosition(location);
      }
    }
  }

  updateClick() {
    this.intersect = this.mouse.intersect(this.getFloorsArrayMeshs());
    // console.log(this.intersect);
    if (this.intersect.length) {
      this.point = this.intersect[0].point;
      const floor = this.getFloorByName(this.intersect[0].object.name);
      // console.log(floor);
      if (floor.length) {
        const dest = this.mouse.intersect(floor[0].destinations.getMeshes());
        // console.log(dest);
        if (dest.length) {
          floor[0].destinations.activateByName(dest[0].object.name);
          this.intersect = [];
        }
      }
    }
  }

  //Point: location of user in xyz coord
  //planePosition: location of plane where the model raycaster is hitting
  updatePlanes(index, point, planePosition) {
    //Create new plane
    // this works by first check to see if the object is close to the x edge using the formula
    // point location - plane position > half the plane width - the distance away that the new planes should be created
    // this works bc it centers it at the origin, then just compares it to th distance away from the origin the plane should be created
    // if the x value if met then this is recorded in xtoggle.
    // the z value is then checked
    // if both the z value and the x value are met there should be a new plane made on the corner as well
    // since the absolute value is used to similify the number of ifs, to get the positive or negative axis a little function isPositive was made and it just compares two points and returns
    // 1 if the object point is greater than the plane positions and -1 otherwise

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

    // Remove plane
    // Iterate over all this, if the distance from the sphere
    this.getFloorsArrayMeshs().filter((n, i) => {
      //clone is used bc I want to modify the y axis value to be the y of the plane
      let distanceFromSphere = point.clone();
      distanceFromSphere.y = n.position.y;
      // distanceTo is a built in function that get the distance between two vectors
      const distance = distanceFromSphere.distanceTo(n.position);
      if (
        distance >
        this.planeInfo.boundingLength + this.planeInfo.planeDiagonal
      ) {
        // console.log("Too far from " + n.name);
        this.planesArray[i].destroy();
        this.scene.remove(n);
        this.planesArray.splice(i, 1);
        return false;
      }
      return true;
    });

    // Update the drop caused by the model
    this.updateDrops(index, point);
  }

  updateDrops(index, location) {
    this.planeInfo.dropLocation[index].x = location.x;
    this.planeInfo.dropLocation[index].y = location.y;
    this.planeInfo.dropLocation[index].z = location.z;
    this.planesArray.forEach((n) => n.setDropLocation(index, location));
  }

  // drop amount, k value, the range
  updateDropsInfo(index, info) {
    this.planeInfo.dropInformation[index].x = info.x;
    this.planeInfo.dropInformation[index].y = info.y;
    this.planeInfo.dropInformation[index].z = info.z;
    this.planesArray.forEach((n) => n.setDropInformation(index, info));
  }

  //general update property
  updatePropery(property, value) {
    this.planesArray.forEach(
      (n) => (n.material.uniforms[property].value = value)
    );
  }

  update() {
    this.planesArray.forEach((n) => n.update());
    if (window.tomsloanTeleportation !== -1) {
      console.log("Val: ", window.tomsloanTeleportation);
      this.movePlayerToLocation();
      window.tomsloanTeleportation = -1;
    }
  }

  setDebug() {
    const params = {};

    params.changeSize = () => {
      if (this.planeInfo.creationBoundary > this.planeInfo.size / 2) {
        this.planeInfo.creationBoundary = 0.2 * this.planeInfo.size;
      }
      this.setLengths();
      this.planesArray.forEach((n) => n.setSize(this.planeInfo.size));
      console.log(this.planeInfo);
    };

    params.changeCreationBoundary = () => {
      if (this.planeInfo.creationBoundary > this.planeInfo.size / 2) {
        this.planeInfo.creationBoundary = 0.2 * this.planeInfo.size;
      }
      this.setLengths();
    };

    params.printShaderUniforms = () =>
      console.log(this.planesArray[0].material.uniforms);

    params.currentLocation = () =>
      console.log(
        "Dropvalue:",
        this.planesArray[0].material.uniforms.uDropLocation.value[0],
        "modelPosition: ",
        this.experience.world.fox.model.position,
        "drop distance: ",
        this.planesArray[0].material.uniforms.uDropInformation.value[0].x *
          this.planesArray[0].material.uniforms.uDropAmount.value
      );

    this.debugFolder.addColor(this.planeInfo, "depthColor").onChange(() => {
      this.updatePropery(
        "uDepthColor",
        new THREE.Color(this.planeInfo.depthColor)
      );
    });

    this.debugFolder.addColor(this.planeInfo, "surfaceColor").onChange(() => {
      this.updatePropery(
        "uSurfaceColor",
        new THREE.Color(this.planeInfo.surfaceColor)
      );
    });
    this.debugFolder
      .add(this.planeInfo, "size")
      .min(1)
      .max(150)
      .step(1)
      .onFinishChange(params.changeSize)
      .name("Size of Plane");

    this.debugFolder
      .add(this.planeInfo, "creationBoundary")
      .min(1)
      .max(this.planeInfo.size / 2)
      .step(1)
      .onFinishChange(params.changeSize)
      .name("Creation Boundary");

    this.debugFolder
      .add(this.planeInfo, "gridDensity")
      .min(1.0)
      .max(100.0)
      .step(0.05)
      .onChange(() =>
        this.updatePropery("uGridDensity", this.planeInfo.gridDensity)
      )
      .name("Grid Density");

    this.debugFolder
      .add(this.planeInfo, "colorOffset")
      .min(0)
      .max(1)
      .step(0.001)
      .name("Color Offset")
      .onChange(() =>
        this.updatePropery("uColorOffset", this.planeInfo.colorOffset)
      );

    this.debugFolder
      .add(this.planeInfo, "colorMultiplier")
      .min(0)
      .max(20)
      .step(0.1)
      .name("Color Multiplier")
      .onChange(() =>
        this.updatePropery("uColorMultiplier", this.planeInfo.colorMultiplier)
      );
    this.debugFolder
      .add(this.planeInfo, "opacityMultiplier")
      .min(0)
      .max(1)
      .step(0.001)
      .name("Opacity Multiplier")
      .onChange(() =>
        this.updatePropery(
          "uOpacityMultiplier",
          this.planeInfo.opacityMultiplier
        )
      );
    this.debugFolder
      .add(this.planeInfo, "gridType", {
        Pattern1: 0,
        Pattern2: 1,
      })
      .name("Grid Layout")
      .onChange(() => this.updatePropery("uGridType", this.planeInfo.gridType));
    this.debugFolder.add(params, "printShaderUniforms");
    this.debugFolder.add(params, "currentLocation");
  }
}
