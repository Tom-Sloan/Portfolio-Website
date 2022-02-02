import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new dat.GUI();
const parameters = {
  createSphere: () =>
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 0,
      z: (Math.random() - 0.5) * 3,
    }),
  createBox: () =>
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }),
  reset: () => {
    for (const object of objectsToUpdate) {
      // Remove body
      object.body.removeEventListener("collide", playHitSound);
      world.removeBody(object.body);

      // Remove mesh
      scene.remove(object.mesh);
    }
  },
};
gui.add(parameters, "createSphere");
gui.add(parameters, "createBox");
gui.add(parameters, "reset");

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
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
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
const world = new CANNON.World();
// world.gravity.set(0, -9.82, 0);

const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0,
    restitution: 1,
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

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
    transparent: true,
    opacity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Floor physics
// const floorShape = new CANNON.Plane();
// const floorBody = new CANNON.Body({
//   //  material: defaultMaterial
// });
// floorBody.mass = 0;
// floorBody.addShape(floorShape);
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// world.addBody(floorBody);

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
 * Utils
 */
const objectsToUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
});
const createSphere = (radius, position) => {
  position.y = radius;
  // Three.js mesh
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(radius, radius, radius);
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  // body.applyLocalForce(new CANNON.Vec3(0, 15, 0), new CANNON.Vec3(0, 0, 0));
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const createBox = (height, width, depth, position) => {
  console.log(position);
  const mesh = new THREE.Mesh(boxGeometry, sphereMaterial);
  mesh.castShadow = true;
  mesh.scale.set(height, width, depth);
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(height / 2, width / 2, depth / 2)
  );

  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    material: defaultMaterial,
    linearDamping: 0.1,
    angularDamping: 0.5,
  });
  body.position.copy(position);

  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
};

const humanMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
  envMapIntensity: 0.5,
  color: "orange",
  asdf: true,
});
const humanGeometru = new THREE.BoxGeometry(1, 1, 1);
const createHuman = (height, width, depth, position) => {
  const mesh = new THREE.Mesh(humanGeometru, humanMaterial);
  mesh.castShadow = true;
  mesh.scale.set(height, width, depth);
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Box(
    new CANNON.Vec3(height / 2, width / 2, depth / 2)
  );

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
    linearDamping: 0.1,
    angularDamping: 0.5,
    type: CANNON.Body.KINEMATIC,
  });
  body.position.copy(position);
  // body.applyLocalForce(new CANNON.Vec3(100, 150, 0), new CANNON.Vec3(0, 0, 0));
  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  });
  human = {
    mesh: mesh,
    body: body,
  };
};
let human = null;

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
camera.position.set(8, 11, 10);
camera.rotateX(-Math.PI / 12);
camera.rotateY(Math.PI / 8);

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// // How far you can orbit vertically, upper and lower limits.
// // Range is 0 to Math.PI radians.
// controls.minPolarAngle = Math.PI / 6; // radians
// controls.maxPolarAngle = Math.PI / 3; // radians

// // How far you can orbit horizontally, upper and lower limits.
// // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
// controls.minAzimuthAngle = Math.PI / 8; // radians
// controls.maxAzimuthAngle = Math.PI / 3; // radians

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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
 * Initilzation
 */

const init = () => {
  createHuman(1, 2, 0.5, { x: 0, y: 3, z: 0 });
};

init();

const mouse = new THREE.Vector2({ x: 0, y: 0 });

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
  mouse.clicked = true;
  console.log(
    "position: ",
    human.body.position,
    "Velocity: ",
    human.body.velocity
  );
});

/**
 * Animatation Variables
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

// For Mouse Interations
const raycaster = new THREE.Raycaster();

//Handling Movement
let direction = new CANNON.Vec3();
let speed = 2;
let movingItems = [];

/**
 * Animation Functions
 */

const updatePositions = () => {
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
    // - 1 raises the ground by 1
    object.body.velocity.y = object.body.position.y * -1;
  }
};

const moveBodyTowardsPosition = (id, body, destination, speed) => {
  // console.log(body, destination, speed);
  const destinationCannon = new CANNON.Vec3(
    destination.x,
    destination.y,
    destination.z
  );
  destinationCannon.vsub(body.position, direction);
  const totalLength = direction.length();
  direction.normalize();

  // body.velocity.x = direction.x * speed;
  // body.velocity.y = direction.y * speed;
  // body.velocity.z = direction.z * speed;
  // body.applyForce(new CANNON.Vec3(10, 0, 0), direction);

  direction.scale(speed, body.velocity);
  console.log("Setting velocity to: ", body.velocity);

  //distance = speed  * time
  // distance / speed = time
  const timeToRun = totalLength / speed + clock.getElapsedTime();

  let index = 0;

  for (let i = 0; i < movingItems.length; i++) {
    if (movingItems[i].time > timeToRun) {
      index = i;
      break;
    }
  }
  movingItems = movingItems.filter((n) => n.id !== id);
  movingItems.splice(index, 0, {
    id,
    body,
    timeToRun,
    destination,
  });
};

const stopMovingBodies = () => {
  movingItems = movingItems.filter((n) => {
    if (n.timeToRun < clock.getElapsedTime()) {
      console.log("Stopping: ", n.body);
      // n.body.velocity.set(0, 0, 0);
      n.body.velocity.x = 0;
      n.body.velocity.y = 0;
      n.body.velocity.z = 0;
      // n.body.velocity = new CANNON.Vec3(0, 0, 0);
      // n.body.velocity.setZero();
      n.body.updateInertiaWorld();
      n.body.position.copy(n.destination);
      console.log("done");
      return false;
    }
    return true;
  });
};

let delay = 5;
let first = true;
let second = true;
let third = true;
/**
 * Animation Running
 */
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  //Update physics Worls
  world.step(1 / 60, deltaTime, 3);

  // Update positions
  updatePositions();

  //Mouse Click
  if (mouse.clicked) {
    //Updating Raycaster (mouse)
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObject(floor);
    if (intersect.length) {
      const point = intersect[0].point;
      // console.log(human);
      moveBodyTowardsPosition(human.mesh.uuid, human.body, point, speed);
      // human.body.applyLocalForce(
      //   new CANNON.Vec3(10, 0, 0),
      //   new CANNON.Vec3(0, 0, 0)
      // );
    }

    mouse.clicked = false;
  }
  if (first && elapsedTime < 5) {
    human.body.velocity.set(1, 0, 1);
    first = false;
  }

  if (second && elapsedTime > 5 && elapsedTime < 7) {
    human.body.velocity.set(0, 0, 0);
    second = false;
  }

  if (third && elapsedTime > 7) {
    human.body.velocity.set(1, 0, 1);
    third = false;
  }

  //Stop Moving Items
  stopMovingBodies();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/*

  if (objectsToUpdate.length && mouse.clicked) {
    console.log("here");
    const human = objectsToUpdate[0];

    //Updating Raycaster (mouse)
    raycaster.setFromCamera(mouse, camera);

    //Objects in sceen
    const objectsToTest = objectsToUpdate.map((n) => n.mesh);
    const intersects = raycaster.intersectObjects(objectsToTest);

    for (const intersect of intersects) {
      intersect.object.material.color.set("#0000ff");
    }

    for (const object of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === object)) {
        object.material.color.set("#ff0000");
      }
    }

    //Floor
    if (raycaster.intersectObject(floor).length) {
      // console.log("here");
      const point = raycaster.intersectObject(floor)[0].point;
      // console.log(point);
      clickLocation = new CANNON.Vec3(point.x, point.y, point.z);
      clickLocation.vsub(human.body.position, direction);
      totalLength = direction.length();
      direction.normalize();

      // console.log("Speed: ", speed, human.body.velocity);
      console.log(
        direction,
        speed,
        human.body.velocity,
        totalLength,
        clickLocation
      );
      direction.scale(speed, human.body.velocity);
      console.log(
        "dir: ",
        direction,
        "\nspeed: ",
        speed,
        "\nhuman: ",
        human.body.velocity,
        "\ntotalLen: ",
        totalLength,
        "\nclicked: ",
        clickLocation
      );
      startTime = world.time;
    }
    mouse.clicked = false;
  }
  
  if (clickLocation) {
    console.log(objectsToUpdate[0].body);
  }

  if (world.time - startTime > totalLength / speed && clickLocation) {
    objectsToUpdate[0].body.velocity.set(0, 0, 0);
    objectsToUpdate[0].body.position.copy(clickLocation);
    clickLocation = null;
    mouse.x = 1;
    mouse.y = -1;
    console.log("done");
  }

*/
