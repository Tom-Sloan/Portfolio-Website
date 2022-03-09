import Matter, { World } from "matter-js";
import Render from "../../components/LandingPage/Render";

export default function Background(reference, isDark) {
  //Create array of bodies
  const bodies = [];
  const width = reference.clientWidth;
  const height = reference.clientHeight;
  const thresholdSpeed = 1;
  const lightColors = [
    "#bda0f2",
    "#b4a1f3",
    "#a7a1f7",
    "#a0a4f7",
    "#9ba8f9",
    "#8db5ff",
    "#82bfff",
    "#78c8ff",
    "#62d8ff",
    "#4ae6ff",
    "#35f2fe",
    "#2dfaed",
  ];
  const darkColors = [
    "#013e6d",
    "#413e7c",
    "#602d6a",
    "#751954",
    "#7c0036",
    "#88042b",
    "#94151f",
    "#932409",
    "#a23708",
    "#b24905",
    "#bf5a02",
    "#cd6c00",
  ];
  let colors = isDark?darkColors:lightColors;
  try {
    if (typeof MatterWrap !== "undefined") {
      // either use by name from plugin registry (Browser global)
      Matter.use("matter-wrap");
    } else {
      // or require and use the plugin directly (Node.js, Webpack etc.)
      Matter.use(require("matter-wrap"));
    }
  } catch (e) {
    // could not require the plugin or install needed
  }

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
  var engine = Engine.create({
      gravity: {
        y: 0,
        x: 0,
      },
    }),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: reference,
    engine: engine,
    options: {
      width: width,
      height: height,
      background: "transparent",
      wireframes: false,
    },
  });

  Render.run(render);
  // create runner
  var runner = Runner.create();
  Runner.run(runner, engine);

  // add bodies
  const generateNewBody = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    let body = Bodies.circle(
      Common.random(0, width),
      Common.random(0, height),
      Common.random(10, 60),
      {
        friction: 0,
        frictionAir: 0,
        restitution: 1,
        density: 0.001,
        render: {
          fillStyle: color,
        },
      }
    );
    Composite.add(world, body);
    try {
      var force = 0.001;
      const xforce =
        (Math.floor(Math.random() * 2) ? 1 : -1) * Common.random(5, 20) * force;
      const yforce =
        (Math.floor(Math.random() * 2) ? 1 : -1) * Common.random(5, 20) * force;
      Body.applyForce(body, body.position, {
        x: xforce,
        y: yforce,
      });
      body.plugin.wrap = {
        min: { x: render.bounds.min.x, y: render.bounds.min.y },
        max: { x: render.bounds.max.x, y: render.bounds.max.y },
      };
    } catch (e) {
      console.log(e);
    }
  };
  for (let i = 0; i < 10; i++) {
    generateNewBody();
  }

  let timeoutId = setTimeout(function creation(index = 1) {
    generateNewBody();

    index++;
    if (index < 100) {
      timeoutId = setTimeout(() => creation(index), 1000);
    }
  }, 1000);

  let timeoutSpeedId = setTimeout(function speedup() {
    world.bodies.forEach((body) => {
      if (body.speed < thresholdSpeed) {
        try {
          var force = 0.005;
          const xforce =
            (Math.floor(Math.random() * 2) ? 1 : -1) *
            Common.random(5, 20) *
            force;
          const yforce =
            (Math.floor(Math.random() * 2) ? 1 : -1) *
            Common.random(5, 20) *
            force;
          Body.applyForce(body, body.position, {
            x: xforce,
            y: yforce,
          });
        } catch (e) {
          console.log(e);
        }
      }
    });

    timeoutSpeedId = setTimeout(speedup, 3000);
  }, 3000);

  // fit the render viewport to the scene
  //   Render.lookAt(render, Composite.allBodies(world));

  // wrapping using matter-wrap plugin
  const changeToDark = (darkMode = false) => {
    
    if (darkMode) 
      colors = darkColors
    else
      colors=lightColors

    world.bodies.forEach(
      (body) =>
        (body.render.fillStyle =
          colors[Math.floor(Math.random() * colors.length)])
    );
  };
  return {
    world: world,
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    bodies: bodies,
    changeToDark: changeToDark,
    runGame: () => {},
    stop: function () {
      clearTimeout(timeoutId);
      clearTimeout(timeoutSpeedId);
      World.clear(world);
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    },
  };
}
