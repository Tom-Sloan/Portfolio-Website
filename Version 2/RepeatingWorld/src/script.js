import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import gsap from "gsap";
import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;

directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

directionalLight.position.set(2, 2, -1);
gui.add(directionalLight, "intensity").min(0).max(1).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
// scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Spot light
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3);
spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

spotLight.shadow.camera.fov = 30;

spotLight.position.set(0, 2, 2);
// scene.add(spotLight)
scene.add(spotLight.target);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Point light
const pointLight = new THREE.PointLight(0xffffff, 0.3);

pointLight.castShadow = true;

pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 3;
// console.log(pointLight.shadow);

pointLight.position.set(-1, 1, 0);
scene.add(pointLight);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = true;
scene.add(pointLightCameraHelper);

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;
scene.add(sphere);
// Creating Raycaster
const sphereRaycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(
  sphere.position.x,
  sphere.position.y + 10,
  sphere.position.z
);
const rayDirection = new THREE.Vector3(0, -1, 0);
rayDirection.normalize();

sphereRaycaster.set(rayOrigin, rayDirection);
sphereRaycaster.far = 20;
sphereRaycaster.firstHitOnly = true;

// Helper
const helperRay = new THREE.ArrowHelper(rayDirection, rayOrigin, 20, "orange");
scene.add(helperRay);

console.log(sphereRaycaster);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 3;
camera.position.z = 0;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * Event Listeners
 */
const mouse = new THREE.Vector2({ x: 0, y: 0 });
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  mouse.clicked = true;
});
/**
 * Animate
 */

let speed = 2;

const clock = new THREE.Clock();

// For Mouse Interations
const raycaster = new THREE.Raycaster();

const moveBodyTowardsPosition = (body, destination, speed) => {
  let direction = destination.clone();
  direction.sub(body.position);
  const totalLength = direction.length();

  const timeToRun = totalLength / speed;
  gsap.to(body.position, {
    duration: timeToRun,
    overwrite: "auto",
    x: destination.x,
    z: destination.z,
    onUpdate: updateSphere,
  });
};
const axesHelper = new THREE.AxesHelper(2.5);
scene.add(axesHelper);

const planes = { planesArray: [], planeInfo: {} };
const createPlane = (location) => {
  if (checkForPreviousPlane(location)) {
    console.log("Cancelling!");
    return;
  }
  const planeWidth = 10;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
  geometry.computeBoundsTree({ lazyGeneration: false });
  const plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.set(location.x, location.y, location.z);
  plane.name = "Plane-" + planes.planesArray.length;
  planes.planesArray.push(plane);
  planes.planeInfo.size = planeWidth;
  scene.add(plane);
};
const checkForPreviousPlane = (location) =>
  planes.planesArray.filter((n) => n.position.equals(location)).length > 0;

const isPositive = (num, relative = 0) =>
  num - relative === 0 ? 0 : num - relative > 0 ? 1 : -1;

const pythagorean = (sideA, sideB) =>
  Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));

//Point: location of sphere
//planePosition: location of current plane
const updatePlanes = (point, planePosition) => {
  //Create new Planes

  let xToggle = false;
  if (
    Math.abs(point.x - planePosition.x) >
    planes.planeInfo.size / 2 - creationBoundary
  ) {
    // console.log("Clicked point.x: ", isPositive(point.x));
    createPlane({
      x:
        planePosition.x +
        isPositive(point.x, planePosition.x) * planes.planeInfo.size,
      y: planePosition.y,
      z: planePosition.z,
    });
    xToggle = true;
  }
  console.log(
    xToggle,
    point.z,
    planePosition.z,
    planes.planeInfo.size / 2 - creationBoundary
  );
  if (
    Math.abs(point.z - planePosition.z) >
    planes.planeInfo.size / 2 - creationBoundary
  ) {
    // console.log("Clicked point.z: ", isPositive(point.z));
    createPlane({
      x: planePosition.x,
      y: planePosition.y,
      z:
        planePosition.z +
        isPositive(point.z, planePosition.z) * planes.planeInfo.size,
    });
    if (xToggle) {
      createPlane({
        x:
          planePosition.x +
          isPositive(point.x, planePosition.x) * planes.planeInfo.size,
        y: planePosition.y,
        z:
          planePosition.z +
          isPositive(point.z, planePosition.z) * planes.planeInfo.size,
      });
    }
  }

  // Remove planes
  // Iterate over all planes, if the distance from the sphere

  planes.planesArray = planes.planesArray.filter((n) => {
    let distanceFromSphere = point.clone();
    distanceFromSphere.y = n.position.y;
    const distance = distanceFromSphere.distanceTo(n.position);

    if (distance > boundingLength + planeDiagonal) {
      console.log("Too far from " + n.name);
      scene.remove(n);
      return false;
    }
    return true;
  });
};

function updateSphere() {
  let elem = this.targets()[0];
  const xVal = gsap.getProperty(elem, "x");
  const zVal = gsap.getProperty(elem, "z");

  sphereRaycaster.ray.origin.setX(xVal);
  sphereRaycaster.ray.origin.setZ(zVal);

  helperRay.position.setX(xVal);
  helperRay.position.setZ(zVal);

  const intersect = sphereRaycaster.intersectObjects(planes.planesArray);
  if (intersect.length) {
    const planePosition = intersect[0].object.position;
    updatePlanes(sphere.position, planePosition);
  }
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update the sphere
  // sphere.position.x = Math.cos(elapsedTime) * 1.5;
  // sphere.position.z = Math.sin(elapsedTime) * 1.5;
  // sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
  //Mouse Click
  if (mouse.clicked) {
    //Updating Raycaster (mouse)
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObjects(planes.planesArray);
    // console.log(intersect[0]);
    if (intersect.length) {
      const point = intersect[0].point;
      console.log("Point:", point);
      // console.log(planePosition);

      moveBodyTowardsPosition(sphere, point, speed);
    }

    mouse.clicked = false;
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
createPlane({ x: 0, y: -0.5, z: 0 });
const creationBoundary = 2;
const boundingLength = pythagorean(creationBoundary, creationBoundary);
const planeDiagonal = pythagorean(
  planes.planeInfo.size / 2,
  planes.planeInfo.size / 2
);
tick();
