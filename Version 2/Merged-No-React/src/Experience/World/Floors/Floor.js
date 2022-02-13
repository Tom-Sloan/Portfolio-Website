import * as THREE from "three";
import Experience from "../../Experience.js";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";
import gridVertexShader from "../shaders/grid/vertex.glsl";
import gridFragmentShader from "../shaders/grid/fragment.glsl";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

export default class Floor {
  constructor(param) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // set values
    this.location = param.location || { x: 0, y: 0, z: 0 };
    this.size = param.size || 5;
    this.name = param.name || "Floor";
    this.depthColor = param.depthColor || "#0373b0";
    this.surfaceColor = param.surfaceColor || "#057dc7";
    this.gridDensity = param.gridDensity || 30.0;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    //make the geometry
    this.geometry = new THREE.PlaneGeometry(1, 1);
    //For fast ray tracing
    this.geometry.computeBoundsTree({ lazyGeneration: false });
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
        uDistance: { value: 1 }, // the distance away that the drop will impact
        uDropAmount: { value: 30 }, // the amout the drop will impact
        uDropCurveSteepness: { value: 1 }, // the k value
        uNumberOfDrops: { value: 0 }, // number of drops there will be
        
        //Point of the drop
        uDropLocation: {
          value: [
            new THREE.Vector3(0.5, 0.5, 0.5),
            new THREE.Vector3(0.1, 0.1, 0.5),
            new THREE.Vector3(0.9, 0.9, 0.5),
            new THREE.Vector3(0.1, 0.1, 0.5),
          ],
        },
        // drop amount, k value, the range
        uDropInformation: {
          value: [
            new THREE.Vector3(0.5, 0.5, 15.0),
            new THREE.Vector3(0.1, 0.1, 15.0),
            new THREE.Vector3(0.9, 0.9, 15.0),
            new THREE.Vector3(0.1, 0.1, 15.0),
          ],
        },
        //how many lines there will be
        uGridDensity: { value: this.gridDensity },

        //where the intersection points are (helper tools)
        uIntersectionPoints: {
          value: [new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5)],
        },

        //Color Controls
        uDepthColor: { value: new THREE.Color(this.depthColor) },
        uSurfaceColor: { value: new THREE.Color(this.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
      },
    });
  }

  increaseNumberOfDrops() {
    this.material.uniforms.uNumberOfDrops.value++;
  }

  decreaseNumberOfDrops() {
    this.material.uniforms.uNumberOfDrops.value--;
  }

  //lets you change any of the uv coords, the drop amount and the k value of a location
  setDropLocation(index, xyzw, value) {
    this.material.uniforms.uDropLocation[index][xyzw] = value;
  }

  // to set the grid density
  setGridDensity(value) {
    this.material.uniforms.uGridDensity.value = value;
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
}
