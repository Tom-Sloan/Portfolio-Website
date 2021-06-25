import Matter, { Vector } from "matter-js";
import Render from "./Render";

export default function World(reference, teleportationBalls) {
  //Create array of bodies
  const bodies = [];
  const width = reference.clientWidth;
  const height = reference.clientHeight;

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
    Query = Matter.Query;

  // create engine
  var engine = Engine.create(),
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

  // see cloth function defined later in this file
  const rowNum = 20;
  const colmNum = 12;
  var cloth = clothFunc(
    0,
    0,
    rowNum,
    colmNum,
    5,
    5,
    false,
    20,
    {},
    {},
    teleportationBalls
  );

  for (let i = 0; i < rowNum; i++) {
    cloth.bodies[i].isStatic = true;
  }

  cloth.bodies[rowNum * colmNum - rowNum + 1].isStatic = true;
  cloth.bodies[rowNum * colmNum - 1].isStatic = true;
  cloth.bodies[rowNum * colmNum - rowNum].isStatic = true;
  cloth.bodies[rowNum * colmNum - 2].isStatic = true;
  Composite.add(world, [cloth]);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.98,
        render: {
          visible: false,
        },
        collisionFilter: { group: 1, mask: 0 },
      },
    });
  Events.on(mouseConstraint, "mouseup", (e) => {
    const possibilities = Query.point(cloth.bodies, e.mouse.position);
    let circle;
    possibilities.forEach((elm) =>
      elm.onClickFunction ? (circle = elm) : circle
    );
    if (circle) {
      circle.onClickFunction();
    }
  });
  Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, Composite.allBodies(world));

  return {
    world: world,
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    bodies: bodies,
    runGame: () => {},
    stop: (function () {
      let executed = false;
      return function () {
        if (!executed) {
          executed = true;
          // World.clear(world);
          try {
            Engine.clear(engine);
            Render.stop(render);
            Runner.stop(runner);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
          } catch (e) {
            console.log(e);
            console.log(executed);
          }
        }
      };
    })(),
  };
}

/**
 * Creates a simple cloth like object.
 * @method cloth
 * @param {number} xx
 * @param {number} yy
 * @param {number} columns
 * @param {number} rows
 * @param {number} columnGap
 * @param {number} rowGap
 * @param {boolean} crossBrace
 * @param {number} particleRadius
 * @param {} particleOptions
 * @param {} constraintOptions
 * @return {composite} A new composite cloth
 */
const clothFunc = function (
  xx,
  yy,
  columns,
  rows,
  columnGap,
  rowGap,
  crossBrace,
  particleRadius,
  particleOptions,
  constraintOptions,
  specialParticles = []
) {
  var Body = Matter.Body,
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites;

  var group = Body.nextGroup(true);

  constraintOptions = Common.extend(
    { stiffness: 0.5, render: { type: "line", anchors: false } },
    constraintOptions
  );

  let points = specialParticles.map((elm) => elm.point);

  var cloth = Composites.stack(
    xx,
    yy,
    columns,
    rows,
    columnGap,
    rowGap,
    function (x, y, column, row, lastBody, i) {
      const index = points.indexOf(i);

      const visibility =
        (specialParticles[index] && specialParticles[index].visibility) ||
        false;
      const label =
        (specialParticles[index] && specialParticles[index].label) || "";
      const color =
        (specialParticles[index] && specialParticles[index].color) || "blue";
      const size =
        (specialParticles[index] && specialParticles[index].size) || 16;
      const family =
        (specialParticles[index] && specialParticles[index].family) ||
        "Papyrus";
      const onClickFunction =
        (specialParticles[index] && specialParticles[index].onClickFunction) ||
        null;
      let particleOptions = {
        inertia: Infinity,
        friction: 0.00001,
        collisionFilter: { group: group },
        render: {
          visible: visibility,
          text: {
            content: label,
            color: color,
            size: size,
            family: family,
          },
        },
        onClickFunction: onClickFunction,
      };

      return Bodies.circle(x, y, particleRadius, particleOptions);
    }
  );

  Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);

  cloth.label = "Cloth Body";

  return cloth;
};
