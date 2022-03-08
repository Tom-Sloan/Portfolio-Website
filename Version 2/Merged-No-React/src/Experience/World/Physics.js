import Matter from "matter-js";
import Experience from "../Experience";
console.log(Matter);
export default class Physics {
  constructor() {
    // project variables
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    //general use variables
    this.bodies = [];
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight;
    this.reference = this.experience.matterjsCanvas;
    this.visibleRenderer = false;
    this.render = null;

    // Scale, this is used because the threejs world uses much smaller numbers,
    // whereas this renderer uses pixels for position
    this.scale = 100;
    this.xScaleFactor = 20;
    this.yScaleFactor = 40;

    //Matterjs variables
    this.Engine = Matter.Engine;
    this.Runner = Matter.Runner;
    this.Body = Matter.Body;
    this.Composites = Matter.Composites;
    this.MouseConstraint = Matter.MouseConstraint;
    this.Mouse = Matter.Mouse;
    this.Composite = Matter.Composite;
    this.Bodies = Matter.Bodies;
    this.Events = Matter.Events;
    this.Query = Matter.Query;
    this.Common = Matter.Common;
    this.Render = Matter.Render;
    this.Detector = Matter.Detector;
    console.log(this.Detector);
    this.createEngine();
    if (this.visibleRenderer) this.createRenderer();
    this.startEngine();
    this.createDetector();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Physics");
      this.debugFolder.close();
      this.setDebug();
    }
  }

  createEngine() {
    this.engine = this.Engine.create({
      gravity: {
        y: 0,
        x: 0,
      },
    });
    this.world = this.engine.world;
  }
  createRenderer() {
    //update 3js canvas
    this.sizes.updateWidth(window.innerWidth / 2);

    this.render = this.Render.create({
      canvas: this.reference,
      options: {
        width: this.width,
        height: this.height,
        background: "transparent",
        wireframes: false,
      }, // https://github.com/liabru/matter-js/issues/241
      // @ts-ignore
      engine: undefined,
    });

    // @ts-ignore
    this.render.engine = this.engine;
    this.render.canvas.style.visibility = "visible";
    this.Render.run(this.render);
  }
  getColor(type) {
    const colors = ["blue", "#FF6464", "#FFE162", "#91C483"];

    let index = 0;
    if (type === "asteroid") {
      index = 1;
    } else if (type === "destination") {
      index = 2;
    } else if (type === "user") {
      index = 3;
    }
    return colors[index];
  }
  startEngine() {
    this.runner = this.Runner.create();
    this.Runner.run(this.runner, this.engine);
  }
  createDetector() {
    this.detector = this.Detector.create();
  }
  toggleRenderer() {
    console.log("here");
    if (this.visibleRenderer) {
      console.log("Creating Matterjs Renderer");
      this.createRenderer();
    } else {
      if (this.render !== null) {
        console.log("Deleteing Matterjs Renderer");
        this.Render.stop(this.render);
        this.render.canvas.style.visibility = "hidden";
        this.render.canvas = null;
        this.render.context = null;
        this.render.textures = {};
        this.render = null;
        this.sizes.updateWidth(window.innerWidth);
      }
    }
  }

  generateNewBody(name, type, position, radius, mesh, callback) {
    // get color
    const color = this.getColor(type);

    let body = 0;
    // create body
    if (type === "destination") {
      body = this.Bodies.rectangle(
        position.x * this.scale,
        position.y * this.scale,
        1,
        1,
        {
          render: {
            fillStyle: color,
          },
          label: name,
        }
      );
    } else {
      body = this.Bodies.circle(
        position.x * this.scale,
        position.y * this.scale,
        1,
        {
          render: {
            fillStyle: color,
          },
          label: name,
        }
      );
    }
    // Scale to size
    this.Body.scale(body, radius * this.scale, radius * this.scale);

    // Add to world
    this.Composite.add(this.world, body);
    // Add to detector
    this.detector.bodies.push(body);

    // If user, focus renderer
    if (this.render !== null && type === "user") {
      this.Render.lookAt(this.render, [body], {
        x: this.scale * this.xScaleFactor,
        y: this.scale * this.xScaleFactor,
      });
    }

    // Record for later use
    this.bodies.push({
      name,
      body,
      color,
      radius,
      type,
      mesh,
      callback,
    });
  }

  deleteBodies() {
    this.Composite.clear(this.world, false);
    this.Detector.clear(this.detector);
    this.bodies = [];
  }

  getBodiesFromLabel(label) {
    return this.bodies.filter((n) => n.name === label)[0] || false;
  }

  checkForCollisions() {
    const collisions = this.Detector.collisions(this.detector);
    if (collisions.length) {
      collisions.forEach((n) => {
        const bodyA = this.getBodiesFromLabel(n.bodyA.label);
        const bodyB = this.getBodiesFromLabel(n.bodyB.label);
        bodyA.callback(bodyB);
        bodyB.callback(bodyA);
      });
    }
  }

  updatePosition(name, position) {
    let body = this.bodies.filter((n) => n.name === name);
    if (body.length > 0) {
      this.Body.setPosition(body[0].body, {
        x: position.x * this.scale,
        y: position.z * this.scale,
      });
      // If user, focus renderer
      this.focusOnUser();
    }
  }

  focusOnUser() {
    let body = this.bodies.filter((n) => n.type === "user");
    if (body.length > 0 && this.render !== null && body[0].type === "user") {
      this.Render.lookAt(this.render, [body[0].body], {
        x: this.scale * this.xScaleFactor,
        y: this.scale * this.xScaleFactor,
      });
    }
  }

  resize() {
    console.log("resized!");
    // this.sizes.updateWidth(window.innerWidth / 2);
    this.width = window.innerWidth / 2;
    this.height = window.innerHeight;
    if (this.render !== null) {
      this.render.options.width = this.width;
      this.render.options.height = this.height;
      this.render.canvas.width = this.width;
      this.render.canvas.height = this.height;
    }
  }

  update() {
    this.checkForCollisions();
  }

  setDebug() {
    const params = {};
    params.printBodies = () => {
      console.log(this.bodies);
    };

    params.moveBody = () => this.updatePosition("My Model", { x: 30, y: 30 });

    params.moveAllBodies = () => {
      this.bodies.forEach((n) =>
        this.Body.setPosition(n.body, {
          x: n.body.position.x + 10,
          y: n.body.position.y - 100,
        })
      );
    };

    this.debugFolder.add(params, "printBodies");
    this.debugFolder.add(params, "moveAllBodies");
    this.debugFolder.add(params, "moveBody");
    this.debugFolder
      .add(this, "visibleRenderer")
      .onFinishChange(() => this.toggleRenderer());

    this.debugFolder
      .add(this, "xScaleFactor")
      .min(1)
      .max(100)
      .step(0.01)
      .onChange(() => this.focusOnUser());
    this.debugFolder.add(this, "yScaleFactor").min(1).max(100).step(0.01);
  }
}
