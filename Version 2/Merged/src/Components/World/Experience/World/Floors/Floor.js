import * as THREE from "three";
import Experience from "../../Experience.js";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";
import gridVertexShader from "../shaders/grid/vertex.js";
import gridFragmentShader from "../shaders/grid/fragment.js";
import Destinations from "../Models/Destinations/Destinations.js";
import Particles from "../Models/Background/Particles.js";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export default class Floor {
  constructor(param) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    // set values
    if (param.geometry) {
      this.geometry = param.geometry;
    } else {
      this.setGeometry();
    }

    this.location = param.location || { x: 0, y: 0, z: 0 };
    this.size = param.size || 5;
    this.name = param.name || "Floor";
    this.depthColor = param.depthColor || "#0373b0";
    this.surfaceColor = param.surfaceColor || "#057dc7";
    this.gridDensity = param.gridDensity || 30.0;
    this.numberOfDrops = param.numberOfDrops || 0.0;
    this.dropLocation = param.dropLocation || [
      new THREE.Vector3(0.5, 0.5, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
      new THREE.Vector3(0.9, 0.9, 0.5),
      new THREE.Vector3(0.1, 0.1, 0.5),
    ];
    this.dropInformation = param.dropInformation || [
      new THREE.Vector3(3, 0.5, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
      new THREE.Vector3(0.9, 0.9, 15.0),
      new THREE.Vector3(0.1, 0.1, 15.0),
    ];
    this.colorMultiplier = param.colorMultiplier || 5;
    this.colorOffset = param.colorOffset || 0.08;
    this.opacityMultiplier = param.opacityMultiplier || 1;
    this.gridType = param.gridType || 0;

    this.setMaterial();
    this.setMesh();
    this.createDestinations();
    this.createParticles();
  }
  setGeometry() {
    const tests = () => {
      //make the geometry
      this.geometry = new THREE.PlaneGeometry(1, 1, 512, 512);
      //For fast ray tracing
      this.geometry.computeBoundsTree({ lazyGeneration: false });
    };
    this.time.timeToRun(tests, "unique geometry");
  }

  setMaterial() {
    //the material
    this.material = new THREE.ShaderMaterial({
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      //so can be viewed from both sides, makes dev more pleasing
      side: THREE.DoubleSide,
      //so opacity works
      transparent: true,

      uniforms: {
        uDropAmount: { value: 3 }, // the amout the drop will impact
        uDropCurveSteepness: { value: 1 }, // the k value
        uNumberOfDrops: { value: this.numberOfDrops }, // number of drops there will be

        //Point of the drop
        uDropLocation: {
          value: [...this.dropLocation],
        },
        // drop amount, k value, the range
        uDropInformation: {
          value: [...this.dropInformation],
        },
        //how many lines there will be
        uGridDensity: { value: this.gridDensity },
        uGridType: { value: this.gridType },

        //Color Controls
        uDepthColor: { value: new THREE.Color(this.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.surfaceColor) },
        uColorOffset: { value: this.colorOffset },
        uColorMultiplier: { value: this.colorMultiplier },
        uOpacityMultiplier: { value: this.opacityMultiplier },

      },
    });
  }

  // create the mesh at a specific location
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    // this.mesh.receiveShadow = true;
    this.setName(this.name);
    this.setPosition(this.location);
    //scale the geometry since this allows dynamic size changing
    this.mesh.scale.set(this.size, this.size, this.size);
    this.scene.add(this.mesh);
  }

  createDestinations() {
    this.destinations = new Destinations(this.mesh, this.name, this.size);
  }
  createParticles() {
    this.particles = new Particles(this.location, this.size);
  }

  getNumberOfDrops() {
    return this.material.uniforms.uNumberOfDrops.value;
  }
  increaseNumberOfDrops() {
    this.material.uniforms.uNumberOfDrops.value++;
  }

  decreaseNumberOfDrops() {
    this.material.uniforms.uNumberOfDrops.value--;
  }

  //lets you change any of the xyz coord to set a specific location
  setUniqueDropLocation(index, xyz, value) {
    this.material.uniforms.uDropLocation[index][xyz] = value;
  }

  // lets you set the drop location of an index
  setDropLocation(index, location) {
    this.material.uniforms.uDropLocation.value[index].x = location.x;
    this.material.uniforms.uDropLocation.value[index].y = location.y;
    this.material.uniforms.uDropLocation.value[index].z = location.z;
  }

  // lets you set the drop information of an index
  setDropInformation(index, info) {
    this.material.uniforms.uDropInformation.value[index].x = info.x;
    this.material.uniforms.uDropInformation.value[index].y = info.y;
    this.material.uniforms.uDropInformation.value[index].z = info.z;
  }

  // to set the grid density
  setGridDensity(value) {
    this.material.uniforms.uGridDensity.value = value;
  }

  // change the location
  setPosition(location) {
    this.mesh.position.set(location.x, location.y, location.z);
  }

  //Change the size by chaning the geometry
  setSize(size) {
    console.log(size);
    this.size = size;
    this.mesh.scale.set(this.size, this.size, this.size);
  }

  //change the name
  setName(name) {
    this.mesh.name = name;
  }

  update() {
    this.destinations.update();
  }

  destroy() {
    if (this.destinations) this.destinations.destroy();
    if (this.particles) this.particles.destroy();
  }
}
