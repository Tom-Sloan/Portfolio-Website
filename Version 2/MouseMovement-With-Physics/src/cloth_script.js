import * as CANNON from "cannon-es";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry.js";

/**
 * Example on how to build a simple physics cloth with
 * just structurals constraints.
 * More info here:
 * https://viscomp.alexandra.dk/?p=147
 */

const clothMass = 1; // 1 kg in total
const clothSize = 1; // 1 meter
const Nx = 12; // number of horizontal particles in the cloth
const Ny = 12; // number of vertical particles in the cloth
const mass = (clothMass / Nx) * Ny;
const restDistance = clothSize / Nx;

const sphereSize = 0.1;
const movementRadius = 0.2;

let clothMesh = null;
// Parametric function
// https://threejs.org/docs/index.html#api/en/geometries/ParametricGeometry
function clothFunction(u, v, target) {
  const x = (u - 0.5) * restDistance * Nx;
  const y = (v + 0.5) * restDistance * Ny;
  const z = 0;

  target.set(x, y, z);

  return target;
}

// three.js variables
let camera, scene, renderer, stats;
let controls;
let clothGeometry;
let sphereMesh;

// cannon.js variables
let world;
let sphereBody;
const particles = [];

initCannon();
initThree();
animate();

function initCannon() {
  world = new CANNON.World();
  world.gravity.set(0, -9.81, 0);

  // Max solver iterations: Use more for better force propagation, but keep in mind that it's not very computationally cheap!
  world.solver.iterations = 20;

  // Materials
  const clothMaterial = new CANNON.Material("cloth");
  const sphereMaterial = new CANNON.Material("sphere");
  const cloth_sphere = new CANNON.ContactMaterial(
    clothMaterial,
    sphereMaterial,
    {
      friction: 0,
      restitution: 0,
    }
  );
  // Adjust constraint equation parameters
  // Contact stiffness - use to make softer/harder contacts
  cloth_sphere.contactEquationStiffness = 1e9;
  // Stabilization time in number of timesteps
  cloth_sphere.contactEquationRelaxation = 3;

  // Add contact material to the world
  world.addContactMaterial(cloth_sphere);

  // Create sphere
  // Make it a little bigger than the three.js sphere
  // so the cloth doesn't clip thruogh
  const sphereShape = new CANNON.Sphere(sphereSize * 1.3);
  sphereBody = new CANNON.Body({
    type: CANNON.Body.KINEMATIC,
  });
  sphereBody.addShape(sphereShape);
  world.addBody(sphereBody);

  // Create cannon particles
  for (let i = 0; i < Nx + 1; i++) {
    particles.push([]);
    for (let j = 0; j < Ny + 1; j++) {
      const index = j * (Nx + 1) + i;

      const point = clothFunction(
        i / (Nx + 1),
        j / (Ny + 1),
        new THREE.Vector3()
      );
      const particle = new CANNON.Body({
        // Fix in place the first row
        mass: j === Ny ? 0 : mass,
      });
      particle.addShape(new CANNON.Particle());
      particle.linearDamping = 0.5;
      particle.position.set(
        point.x,
        point.y - Ny * 0.9 * restDistance,
        point.z
      );
      particle.velocity.set(0, 0, -0.1 * (Ny - j));

      particles[i].push(particle);
      world.addBody(particle);
    }
  }

  // Connect the particles with distance constraints
  function connect(i1, j1, i2, j2) {
    world.addConstraint(
      new CANNON.DistanceConstraint(
        particles[i1][j1],
        particles[i2][j2],
        restDistance
      )
    );
  }
  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      if (i < Nx) connect(i, j, i + 1, j);
      if (j < Ny) connect(i, j, i, j + 1);
    }
  }
}

function initThree() {
  // Camera
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.5,
    10000
  );
  camera.position.set(Math.cos(Math.PI / 4) * 3, 0, Math.sin(Math.PI / 4) * 3);

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 500, 10000);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color);

  renderer.outputEncoding = THREE.sRGBEncoding;

  document.body.appendChild(renderer.domElement);

  // Stats.js
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // Orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.3;
  controls.minDistance = 1;
  controls.maxDistance = 5;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.75);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Cloth material
  const clothTexture = new THREE.TextureLoader().load("textures/sunflower.jpg");
  clothTexture.wrapS = THREE.RepeatWrapping;
  clothTexture.wrapT = THREE.RepeatWrapping;
  clothTexture.anisotropy = 16;
  clothTexture.encoding = THREE.sRGBEncoding;

  const clothMaterial = new THREE.PointsMaterial({
    map: clothTexture,
    side: THREE.DoubleSide,
  });

  // Cloth geometry
  clothGeometry = new ParametricGeometry(clothFunction, Nx, Ny);

  // Cloth mesh
  clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
  scene.add(clothMesh);

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry(sphereSize, 20, 20);
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

  sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Step the physics world
  world.fixedStep();

  // Sync the three.js meshes with the bodies
  updateMeshes();

  // Render three.js
  renderer.render(scene, camera);

  stats.update();
}

function updateMeshes() {
  if (clothMesh === null) return;
  // Make the three.js cloth follow the cannon.js particles
  const buff = [];
  for (let i = 0; i < Nx + 1; i++) {
    for (let j = 0; j < Ny + 1; j++) {
      const index = j * (Nx + 1) + i;
      buff.push(particles[i][j].position.x);
      buff.push(particles[i][j].position.x);
      buff.push(particles[i][j].position.z);
      //clothGeometry.index.array
    }
  }

  buff.forEach((n, i) => {
    clothGeometry.attributes.position[i] = n;
  });
  // clothGeometry.attributes.position = buff;
  // console.log(Nx * Ny * 3);
  console.log(buff, clothGeometry.attributes);
  // clothGeometry.attributes.position[0] = buff[0];

  clothGeometry.normalsNeedUpdate = true;
  clothGeometry.verticesNeedUpdate = true;

  // Move the ball in a circular motion
  const { time } = world;
  sphereBody.position.set(
    movementRadius * Math.sin(time),
    0,
    movementRadius * Math.cos(time)
  );

  // Make the three.js ball follow the cannon.js one
  // Copying quaternion is not needed since it's a sphere
  sphereMesh.position.copy(sphereBody.position);
}
