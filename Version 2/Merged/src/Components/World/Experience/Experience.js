import * as THREE from "three";
import Stats from "stats.js";

import Debug from "./Utils/Debug.js";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";

import sources from "./sources.js";
import Mouse from "./Utils/Mouse.js";

let instance = null;

export default class Experience {
  constructor(_canvas, _matterjs, callback, destinations) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;
    this.matterjsCanvas = _matterjs;
    this.callback = callback;
    this.destinations = destinations;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera(false);
    this.mouse = new Mouse();
    this.renderer = new Renderer();
    this.world = new World();

    //For Stats
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // Mouse move event
    this.mouse.on("mousemove", () => {
      this.mouseMove();
    });

    //Mouse Click Events
    this.mouse.on("mouseclick", () => this.mouseClick());

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      stats.begin();
      this.update();
      stats.end();
    });

    // On W press
    this.mouse.on("cameraChange", () => {
      this.wPress();
    });
  }

  mouseClick() {
    this.world.updateClick();
  }

  mouseMove() {
    this.camera.updatePosition();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  wPress() {
    this.camera.changeView();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
