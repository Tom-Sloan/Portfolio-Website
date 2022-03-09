import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader.js";
import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.loadingBarElement = document.querySelector(".loadingBar");
    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.manager = new THREE.LoadingManager(
      // Loaded
      () => {
        console.log("loaded");
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal;

        this.loadingBarElement.style.transform = `scaleX(${progressRatio})`;
      }
    );
    this.loaders.gltfLoader = new GLTFLoader(this.loaders.manager);
    this.loaders.textureLoader = new THREE.TextureLoader(this.loaders.manager);
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
      this.loaders.manager
    );
    this.loaders.dracoLoader = new DRACOLoader(this.loaders.manager);
    this.loaders.dracoLoader.setDecoderPath("./static/draco/");
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          } // called while loading is progressing
        );
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
