import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";
import Matter, { World } from "matter-js";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};

debugObject.createSphere = () => {
  const radius = Math.random() * 0.5;
  createSphere(radius, {
    x: (Math.random() - 0.5) * 3,
    y: radius,
    z: (Math.random() - 0.5) * 3,
  });
};

gui.add(debugObject, "createSphere");

debugObject.createBox = () => {
  const height = Math.random();
  createBox(Math.random(), height, Math.random(), {
    x: (Math.random() - 0.5) * 3,
    y: height / 2,
    z: (Math.random() - 0.5) * 3,
  });
};
gui.add(debugObject, "createBox");

// Reset
debugObject.reset = () => {
  for (const object of objectsToUpdate) {
    // Remove body
    // object.body.removeEventListener("collide", playHitSound);
    world_cannon.removeBody(object.body);

    // Remove mesh
    scene.remove(object.mesh);
  }
};
gui.add(debugObject, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */
const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collision) => {
  console.log("Contact: ", collision);

  //   const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  //   if (impactStrength > 1.5) {
  //     hitSound.volume = Math.random();
  //     hitSound.currentTime = 0;
  //     hitSound.play();
  //   }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */

//Create module aliases
const Engine = Matter.Engine,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Composites = Matter.Composites,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies,
  Events = Matter.Events,
  Query = Matter.Query,
  Common = Matter.Common;

// create engine
let engine = Engine.create({
    gravity: {
      y: 0,
      x: 0,
    },
    enableSleeping: true,
  }),
  world = engine.world;

// create runner
let runner = Runner.create();
Runner.run(runner, engine);

/**
 * Utils
 */
const objectsToUpdate = [];

// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});

const createSphere = (radius, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  scene.add(mesh);

  let body = Bodies.circle(position.x, position.z, radius, {
    friction: 0,
    frictionAir: 0,
    restitution: 1,
    density: 0.001,
  });
  Composite.add(world, body);
  //   Events.on(engine, "collisionStart", playHitSound);

  // Save in objects
  objectsToUpdate.push({ mesh, body });
};

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
//createBox(1, 1.5, 2, { x: 0, y: 3, z: 0 });
const createBox = (width, height, depth, position) => {
  // Three.js mesh
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Matter.js body

  let body = Bodies.rectangle(position.x, position.z, width, depth, {
    friction: 0,
    frictionAir: 0,
    restitution: 1,
    density: 0.001,
  });
  Composite.add(world, body);
  //   Events.on(engine, "collisionStart", playHitSound);

  //   const shape = new CANNON.Box(
  //     new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  //   );
  //   const body = new CANNON.Body({
  //     mass: 1,
  //     position: new CANNON.Vec3(0, 3, 0),
  //     shape: shape,
  //     material: defaultMaterial,
  //   });
  //   body.position.copy(position);
  //   body.addEventListener("collide", playHitSound);
  //   world_cannon.addBody(body);

  // Save in objects
  objectsToUpdate.push({ mesh, body });
};

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;
/**
 *  Helpers
 */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Object Creation
 */

const push_asteroids = () => {};

const init = () => {
  createSphere(0.2, {
    x: (Math.random() - 0.5) * 3,
    y: 0.2,
    z: (Math.random() - 0.5) * 3,
  });

  push_asteroids();
};

init();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  for (const object of objectsToUpdate) {
    // if (elapsedTime < 30) console.log(object.body.position);
    // object.mesh.position.copy(object.body.position);
    object.mesh.position.x = object.body.position.x;
    object.mesh.position.z = object.body.position.y;
    // object.mesh.quaternion.copy(object.body.quaternion);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
