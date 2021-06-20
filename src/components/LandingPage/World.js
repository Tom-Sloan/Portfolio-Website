import Matter from "matter-js";

export default function World(reference) {
  const bodies = [];
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
    Body = Matter.Body;

  //Create an engine
  const engine = Engine.create({
    gravity: {
      y: 1,
    },
  });

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
  bodies.push(Bodies.circle(210, 100, 30, { restitution: 0.9 }));
  bodies.push(Bodies.circle(110, 50, 30, { restitution: 0.9 }));

  bodies.push(Bodies.rectangle(200, 0, 600, 50, { isStatic: true }));
  bodies.push(Bodies.rectangle(200, 600, 600, 50, { isStatic: true }));
  bodies.push(Bodies.rectangle(260, 300, 50, 600, { isStatic: true }));
  bodies.push(Bodies.rectangle(0, 300, 50, 600, { isStatic: true }));

  bodies.push(mouseConstraint);
  bodies.push(
    Composites.pyramid(320, 220, 16, 7, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 30, 30, {
        render: {
          fillStyle: "red",
          strokeStyle: "black",
        },
      });
    })
  );

  var group = Body.nextGroup(true);

  var ropeA = Composites.stack(100, 50, 8, 1, 10, 10, function (x, y) {
    return Bodies.rectangle(x, y, 50, 20, {
      collisionFilter: { group: group },
    });
  });

  Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
    stiffness: 0.8,
    length: 2,
    render: { type: "line" },
  });
  Composite.add(
    ropeA,
    Constraint.create({
      bodyB: ropeA.bodies[0],
      pointB: { x: -25, y: 0 },
      pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
      stiffness: 0.5,
    })
  );

  bodies.push(ropeA);
  var boxes = Composites.stack(500, 80, 3, 1, 10, 0, function (x, y) {
    return Bodies.rectangle(x, y, 50, 40);
  });

  Composites.chain(boxes, 0.5, 0, -0.5, 0, { stiffness: 1 });

  Composite.add(
    boxes,
    Constraint.create({
      bodyA: boxes.bodies[0],
      pointB: { x: 600, y: 15 },
      stiffness: 0.0002,
    })
  );

  bodies.push(boxes);

  const vertices = [
    {x : 0 , y : 0},
    {x : 0 , y : 50},
    {x : 25 , y : 25},
    {x : 50 , y : 50},
    {x : 50 , y : 0}
]
bodies.push(Bodies.fromVertices(300, 300, vertices))

  //Add create new body event
  Matter.Events.on(mouseConstraint, "mousedown", function (event) {
    World.add(engine.world, Bodies.circle(150, 50, 30, { restitution: 0.9 }));
  });

  //create render
  const render = Render.create({
    element: reference,
    engine: engine,
    options: {
      background: "transparent",
      width: reference.clientWidth,
      height: reference.clientHeight,
      wireframes: false,
      showAngleIndicator: true,
      showCollisions: true,
      showVelocity: true,
    },
  });

  //Add bodies to world
  const world=engine.world;
  World.add(world, bodies);

  Render.run(render);

  // create runner
  var runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      World.clear(world);
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(runner);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
      console.log("reset clicked");
    },
  };
}
/*
import Matter from "matter-js";

export default function World(reference) {
  var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: reference,
        engine: engine,
        options: {
            width: reference.clientWidth,
            height: reference.clientHeight,
            showAngleIndicator: true,
            showCollisions: true,
            showVelocity: true
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var group = Body.nextGroup(true);
        
    var ropeA = Composites.stack(100, 50, 8, 1, 10, 10, function(x, y) {
        return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
    });
    
    Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
    Composite.add(ropeA, Constraint.create({ 
        bodyB: ropeA.bodies[0],
        pointB: { x: -25, y: 0 },
        pointA: { x: ropeA.bodies[0].position.x, y: ropeA.bodies[0].position.y },
        stiffness: 0.5
    }));
    
    group = Body.nextGroup(true);
    
    var ropeB = Composites.stack(350, 50, 10, 1, 10, 10, function(x, y) {
        return Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
    });
    
    Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
    Composite.add(ropeB, Constraint.create({ 
        bodyB: ropeB.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
        stiffness: 0.5
    }));
    
    group = Body.nextGroup(true);

    var ropeC = Composites.stack(600, 50, 13, 1, 10, 10, function(x, y) {
        return Bodies.rectangle(x - 20, y, 50, 20, { collisionFilter: { group: group }, chamfer: 5 });
    });
    
    Composites.chain(ropeC, 0.3, 0, -0.3, 0, { stiffness: 1, length: 0 });
    Composite.add(ropeC, Constraint.create({ 
        bodyB: ropeC.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: ropeC.bodies[0].position.x, y: ropeC.bodies[0].position.y },
        stiffness: 0.5
    }));
    
    Composite.add(world, [
        ropeA,
        ropeB,
        ropeC,
        Bodies.rectangle(400, 600, 1200, 50.5, { isStatic: true })
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 700, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
}
*/
