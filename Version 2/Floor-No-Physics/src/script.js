import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import gridVertexShader from "./shaders/grid/vertex.glsl";
import gridFragmentShader from "./shaders/grid/fragment.glsl";
import galaxyVertexShader from "./shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/** Load Texture */
const asteroidTextures = [];
const addTextures = () => {
  const textureLoader = new THREE.TextureLoader();
  asteroidTextures.push({
    key: "transparent",
    value: true,
  });
  asteroidTextures.push({
    key: "opacity",
    value: 1,
  });
  asteroidTextures.push({
    key: "map",
    value: textureLoader.load("/asteroids/asteroid1/basecolor.jpg"),
  });
  asteroidTextures.push({
    key: "displacementScale",
    value: 0.7,
  });
  asteroidTextures.push({
    key: "displacementMap",
    value: textureLoader.load("/asteroids/asteroid1/height.jpg"),
  });
  asteroidTextures.push({
    key: "normalMap",
    value: textureLoader.load("/asteroids/asteroid1/normal.jpg"),
  });
  asteroidTextures.push({
    key: "aoMap",
    value: textureLoader.load("/asteroids/asteroid1/ambientOcclusion.jpg"),
  });
  asteroidTextures.push({
    key: "aoMapIntensity",
    value: 1,
  });
  asteroidTextures.push({
    key: "roughnessMap",
    value: textureLoader.load("/asteroids/asteroid1/roughness.jpg"),
  });
};
/**
 * grid mesh
 */
let gridGeometry = null;
let gridMaterial = null;
const generateGrid = () => {
  // Colors
  parameters.depthColor = "#0373b0";
  parameters.surfaceColor = "#057dc7";

  gui.addColor(parameters, "depthColor").onChange(() => {
    gridMaterial.uniforms.uDepthColor.value.set(parameters.depthColor);
  });
  gui.addColor(parameters, "surfaceColor").onChange(() => {
    gridMaterial.uniforms.uSurfaceColor.value.set(parameters.surfaceColor);
  });

  // Geometry
  gridGeometry = new THREE.PlaneGeometry(10, 10, 1024, 1024);

  // Material
  gridMaterial = new THREE.ShaderMaterial({
    vertexShader: gridVertexShader,
    fragmentShader: gridFragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uDistance: { value: 0.5 },
      uDropAmount: { value: 2 },
      uDropCurveSteepness: { value: 20 },
      uNumberOfDrops: { value: 1 },
      uDropLocation: {
        value: [
          new THREE.Vector2(0.5, 0.5),
          new THREE.Vector2(0.1, 0.1),
          new THREE.Vector2(0.9, 0.9),
          new THREE.Vector2(0.1, 0.1),
        ],
      },
      uGridDensity: { value: 30.0 },
      uIntersectionPoints: {
        value: [new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.5, 0.5)],
      },

      //Color Controls
      uDepthColor: { value: new THREE.Color(parameters.depthColor) },
      uSurfaceColor: { value: new THREE.Color(parameters.surfaceColor) },
      uColorOffset: { value: 0.08 },
      uColorMultiplier: { value: 5 },
    },
  });

  // Mesh
  const mesh = new THREE.Mesh(gridGeometry, gridMaterial);
  mesh.receiveShadow = true;
  mesh.rotateX(Math.PI / 2);
  scene.add(mesh);
  return mesh;
};

/**
 * Galaxy Mesh
 */

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 200000;
parameters.size = 0.005;
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = "#ff6030";
parameters.outsideColor = "#1b3984";

let galaxyGeometry = null;
let galaxyMaterial = null;
let points = null;

const generateGalaxy = () => {
  if (points !== null) {
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  galaxyGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const randomness = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const scales = new Float32Array(parameters.count * 1);

  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;

    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = -10;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    // Color
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Scale
    scales[i] = Math.random();
  }

  galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  galaxyGeometry.setAttribute(
    "aRandomness",
    new THREE.BufferAttribute(randomness, 3)
  );
  galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  galaxyGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  /**
   * galaxyMaterial
   */
  galaxyMaterial = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 30 * renderer.getPixelRatio() },
    },
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
  });

  /**
   * Points
   */
  points = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(points);
};

/**
 * Generate Spheres
 */
//
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   new THREE.MeshStandardMaterial()
// );
// plane.receiveShadow = true;
// plane.rotation.x = -Math.PI * 0.5;
// plane.position.y = -0.5;
// scene.add(plane);
// scene.updateMatrixWorld(true);
// let position = new THREE.Vector3();
// position.getPositionFromMatrix(asteroid.matrixWorld);

// console.log(position.x + "," + position.y + "," + position.z);

// gridMaterial.uniforms.uDropLocation.value[0] = new THREE.Vector2(
//   asteroid.position.x,
//   asteroid.position.y
// );
// console.log(gridMaterial.uniforms.uDropLocation.value[0]);

//Variable
const asteroids = [];

const generateSphere = () => {
  //Creating asteroid
  const radius = Math.random();
  const geometry = new THREE.SphereGeometry(radius, 512, 512);
  const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
  const asteroid = new THREE.Mesh(geometry, material);
  //Asteroid Params
  asteroid.castShadow = true;
  asteroid.receiveShadow = true;
  asteroid.position.set(1, 0.5, 0);
  asteroidTextures.forEach((n) => (asteroid.material[n.key] = n.value));
  //Adding Asteroid
  scene.add(asteroid);

  // Creating Raycaster
  const raycaster = new THREE.Raycaster();
  const rayOrigin = new THREE.Vector3(
    asteroid.position.x,
    asteroid.position.y + 10,
    asteroid.position.z
  );
  const rayDirection = new THREE.Vector3(0, -1, 0);
  rayDirection.normalize();
  scene.add(new THREE.ArrowHelper(rayDirection, rayOrigin, 20, "orange"));
  raycaster.set(rayOrigin, rayDirection);
  raycaster.far = 20;
  // Helper
  scene.add(new THREE.ArrowHelper(rayDirection, rayOrigin, 20, "orange"));

  // Saving for later
  asteroids.push({ body: asteroid, raycaster });

  console.log(asteroid);
};
//Adding to debug variable to use as button
parameters.generateSphere = generateSphere;

//Add debug console
const addDebugConsole = () => {
  gui.add(parameters, "generateSphere");

  gui
    .add(gridMaterial.uniforms.uGridDensity, "value")
    .min(0)
    .max(100)
    .step(1)
    .name("uGridDensity");

  gui
    .add(gridMaterial.uniforms.uDistance, "value")
    .min(0)
    .max(1.5)
    .step(0.01)
    .name("Distance");

  gui
    .add(gridMaterial.uniforms.uDropAmount, "value")
    .min(0)
    .max(1.5)
    .step(0.01)
    .name("uDropAmount");

  gui
    .add(gridMaterial.uniforms.uDropCurveSteepness, "value")
    .min(0)
    .max(40)
    .step(0.01)
    .name("uDropCurveSteepness");

  gui
    .add(gridMaterial.uniforms.uNumberOfDrops, "value")
    .min(0)
    .max(4)
    .step(1)
    .name("uNumberOfDrops");

  gui
    .add(gridMaterial.uniforms.uDropLocation.value[0], "x")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationX");

  gui
    .add(gridMaterial.uniforms.uDropLocation.value[0], "y")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationY");
  gui
    .add(gridMaterial.uniforms.uDropLocation.value[1], "x")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationX1");

  gui
    .add(gridMaterial.uniforms.uDropLocation.value[1], "y")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationY1");
  gui
    .add(gridMaterial.uniforms.uDropLocation.value[2], "x")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationX2");

  gui
    .add(gridMaterial.uniforms.uDropLocation.value[2], "y")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationY2");
  gui
    .add(gridMaterial.uniforms.uDropLocation.value[3], "x")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationX3");

  gui
    .add(gridMaterial.uniforms.uDropLocation.value[3], "y")
    .min(0)
    .max(1)
    .step(0.01)
    .name("uDropLocationY3");

  gui
    .add(parameters, "count")
    .min(100)
    .max(1000000)
    .step(100)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "radius")
    .min(0.01)
    .max(20)
    .step(0.01)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "branches")
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomness")
    .min(0)
    .max(2)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui
    .add(parameters, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.001)
    .onFinishChange(generateGalaxy);
  gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
  gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);
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

/** Lights */
const addLights = (helpers = true) => {
  /**
   * Lights
   */

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);

  pointLight.position.set(0, 5, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;

  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 7;
  scene.add(pointLight);

  if (helpers) {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLight.shadow.camera
    );
    scene.add(pointLightCameraHelper);
  }
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 3, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/** Events */

const updatePositions = (elapsedTime) => {
  asteroids.forEach((n, i) => {
    //Asteroid
    const asteroid = n.body;
    asteroid.position.z = Math.sin(elapsedTime * 0.3) * 1.5;

    //Raycaster
    const raycaster = n.raycaster;
    // console.log(raycaster);
    // console.log(n.body.position);
    raycaster.ray.origin.set(
      n.body.position.x,
      n.body.position.y,
      n.body.position.z
    );

    const intersection = raycaster.intersectObject(gridMesh);

    intersection.forEach((n, intersectionIndex) => {
      if (intersectionIndex === 0) {
        gridMaterial.uniforms.uIntersectionPoints.value[intersectionIndex] =
          n.uv;
        gridMaterial.uniforms.uDropLocation.value[i] = n.uv;
      }
    });
  });
};
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //Check Raycaster collisions
  updatePositions(elapsedTime);

  // Update controls
  controls.update();
  // Update material
  galaxyMaterial.uniforms.uTime.value = elapsedTime;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
addLights();
const gridMesh = generateGrid();
generateGalaxy();
addTextures();
addDebugConsole();
generateSphere();
tick();
