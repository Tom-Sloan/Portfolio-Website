import Matter from "matter-js";

export default function World(reference) {
  //Create array of bodies
  const bodies = [];
  const width = reference.clientWidth;
  const height = reference.clientHeight;
  const redColor = "#F23557";
  const yellowColor = "#F0D43A";
  const blueColor = "#22B2DA";
  const darkColor = "#3B4A6B";

  //Create module aliases
  const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    Body = Matter.Body,
    Vector = Matter.Vector.create;

  //Create an engine
  const engine = Engine.create({
    gravity: {
      y: 0,
    },
  });

  //BODY CREATION
  // add mouse control
  const mouse = Mouse.create(reference);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  //Create Bodies
  const circle1 = Bodies.circle(210, 100, 30, {
    restitution: 0.9,
    frictionAir: 0.05,
    render: {
      fillStyle: blueColor,
    },
  });
  bodies.push(circle1);
  const circle2 = Bodies.circle(300, 500, 30, {
    restitution: 0.9,
    frictionAir: 0.1,
  });
  const a = Constraint.create({
    bodyB: circle2,
    pointA: { x: circle2.position.x, y: circle2.position.y },
    stiffness: 0.0001,
    length: 0,
    render: {
      visible: false,
    },
  });
  bodies.push(a);
  bodies.push(circle2);

  bodies.push(mouseConstraint);

  const vertices = [
    { x: 25, y: 0 },
    { x: 0, y: 25 },
    { x: 25, y: 50 },
    { x: 50, y: 25 },
  ];
  const verticesBody = Bodies.fromVertices(400, 300, vertices);
  bodies.push(verticesBody);

  const floatingDiamonds = Composites.stack(
    width / 8,
    height / 8,
    7,
    3,
    height / 6,
    width / 8,
    (x, y) => {
      return Bodies.fromVertices(x, y, vertices, {
        restitution: 0.9,
        frictionAir: 0.01,
        render: {
          fillStyle: yellowColor,
        },
      });
    }
  );
  bodies.push(floatingDiamonds);

  floatingDiamonds.bodies.forEach((elm) => {
    bodies.push(
      Constraint.create({
        bodyB: elm,
        pointA: { x: elm.position.x, y: elm.position.y },
        stiffness: 0.0001,
        length: 0,

      })
    );
  });

  //EVENTS
  //Add create new body event
  Matter.Events.on(mouseConstraint, "mousemove", function (event) {
    try {
      const circle1 = bodies[0];
      var targetAngle = Matter.Vector.angle(circle1.position, mouse.position);
      var force = 0.008;

      Body.applyForce(circle1, circle1.position, {
        x: Math.cos(targetAngle) * force,
        y: Math.sin(targetAngle) * force,
      });
    } catch (e) {
      console.log(e);
    }
  });
  const getPosition = () => {
    const outsideValue = Math.floor(Math.random() * 2);
    const sideValue = Math.floor(Math.random() * 2) ? 1 : -1
    const widthValues = [
      Math.floor(Math.random() * width),
      sideValue? width + 100 : -100,
    ][outsideValue ? 1 : 0];
    const heightValues = [
      sideValue? height + 100 : -100,
      Math.floor(Math.random() * height),
    ][outsideValue ? 1 : 0];
    // console.log(outsideValue, sideValue, widthValues, heightValues)
    return { x: widthValues, y: heightValues };
  };
  let timeout;
  const runGame = (toggle) => {
    if (toggle) {
      setTimeout(function createEnemies() {
        const pos = getPosition();
        const enemy = Bodies.circle(pos.x, pos.y, 30, {
          restitution: 0.9,
          frictionAir: 0,
        });
        World.add(engine.world, enemy);
        const scaleForce = 0.0003;
        console.log({ x:(circle1.position.x - enemy.position.x) * scaleForce, y: (circle1.position.y - enemy.position.y) * scaleForce })
        Body.applyForce(enemy, enemy.position, { x:(circle1.position.x - enemy.position.x) * scaleForce, y: (circle1.position.y - enemy.position.y) * scaleForce });
        timeout = setTimeout(createEnemies, 1000);
      }, 1000);
    } else {
      clearTimeout(timeout);
    }
  };

  //create render
  const render = Render.create({
    element: reference,
    engine: engine,
    options: {
      background: "transparent",
      width: width,
      height: height,
      wireframes: false,
      showAngleIndicator: true,
      showCollisions: true,
      showVelocity: true,
    },
  });

  //Add bodies to world
  const world = engine.world;
  World.add(world, bodies);

  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);
  // console.log(bodies);
  return {
    world: world,
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    bodies: bodies,
    runGame: runGame,
    stop: function () {
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
