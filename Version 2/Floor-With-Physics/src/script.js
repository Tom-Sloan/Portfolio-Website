import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as CANNON from "cannon-es";

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
const particleTexture = textureLoader.load("/textures/particles/1.png");

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry();
const rows = 40;
const columns = 30;
const count = rows * columns * 3;
const densityFactor = 5;
const positions = new Float32Array(count);

positions.fill(0);

let row = (-1 * rows) / 2;
let column = (-1 * columns) / 2;
let counter = 0;
for (let i = 0; i < count; i += 3) {
  positions[i] = column / densityFactor;
  positions[i + 2] = row / densityFactor;

  if (counter === columns - 1) {
    row++;
    column = (-1 * columns) / 2;
    counter = 0;
  } else {
    counter++;
    column++;
  }
}

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial();

particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;

particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;

// particlesMaterial.vertexColors = true;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Add Physics
 */

const world = new CANNON.World();
const mass = 1000;
const stitches = [];
const basePoints = [];
const springs = [];

world.gravity.set(0, 0, 0);

const createStitches = () => {
  // We don't want a sphere nor a cube for each point of our cloth. Cannon provides the Particle() object, a shape with ... no shape at all!
  const particleShape = new CANNON.Particle();

  const { position } = particlesGeometry.attributes;
  console.log(position);
  for (let i = 0; i < position.count; i++) {
    const pos = new CANNON.Vec3(
      position.getX(i),
      position.getY(i),
      position.getZ(i)
    );

    const stitch = new CANNON.Body({
      // We divide the mass of our body by the total number of points in our mesh. This way, an object with a lot of vertices doesn’t have a bigger mass.
      mass: mass / position.count,

      // Just for a smooth rendering, you can drop this line but your cloth will move almost infinitely.
      linearDamping: 0.8,

      position: pos,
      shape: particleShape,

      // TEMP, we’ll delete later
      velocity: new CANNON.Vec3(getRandom(10), getRandom(10), getRandom(10)),
    });

    const basePoint = new CANNON.Body({
      // We divide the mass of our body by the total number of points in our mesh. This way, an object with a lot of vertices doesn’t have a bigger mass.
      mass: 0,

      // Just for a smooth rendering, you can drop this line but your cloth will move almost infinitely.
      linearDamping: 0.8,

      position: pos,
      shape: particleShape,
    });
    stitches.push(stitch);
    world.addBody(stitch);

    basePoints.push(basePoint);
    world.addBody(basePoint);

    const spring = new CANNON.Spring(basePoint, stitch, {
      localAnchorA: new CANNON.Vec3(0, -1, 0),
      localAnchorB: new CANNON.Vec3(0, 0, 0),
      restLength: 0,
      stiffness: 90,
      damping: 0,
    });

    springs.push(spring);
  }

  //   for (let i = 0; i < position.count; i++) {
  //     const col = getColumn(i);
  //     const row = getRow(i);
  //     console.log(row, rows - 1);
  //     if (col < columns - 1) connect(i, i + 1);
  //     if (row < rows - 1) connect(i, i + columns);
  //   }
};

//https://tympanus.net/codrops/2020/02/11/how-to-create-a-physics-based-3d-cloth-with-cannon-js-and-three-js/

const getRandom = (i) => (Math.random() - 0.5) * 2 * i;
world.addEventListener("postStep", (event) => {
  springs.forEach((n) => n.applyForce());
});

const connect = (i, j) => {
  //   console.log(i, j);
  const c = new CANNON.DistanceConstraint(stitches[i], stitches[j]);
  world.addConstraint(c);
};

const getColumn = (i) => {
  const row = i % columns;
  return row;
};

const getRow = (i) => {
  const column = Math.floor(i / columns);
  return column;
};

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
camera.position.set(10, 10, -5);
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  //   const elapsedTime = clock.getElapsedTime();
  //   const deltaTime = elapsedTime - oldElapsedTime;
  //   oldElapsedTime = elapsedTime;

  //   //Update physics Worls
  //   world.step(1 / 60, deltaTime, 3);
  world.fixedStep();

  // Update particles
  //   for (let i = 0; i < count; i++) {
  //     let i3 = i * 3;

  //     const x = particlesGeometry.attributes.position.array[i3];
  //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
  //       elapsedTime + x
  //     );
  //   }
  const { position } = particlesGeometry.attributes;

  for (let i = 0; i < position.count; i++) {
    position.setXYZ(
      i,
      stitches[i].position.x,
      stitches[i].position.y,
      stitches[i].position.z
    );
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

createStitches();

tick();
