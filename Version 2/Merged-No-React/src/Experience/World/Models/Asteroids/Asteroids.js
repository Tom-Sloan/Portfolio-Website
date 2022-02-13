import Experience from "../../../Experience.js";
import Asteroid from "./Asteroid.js";

export default class Asteroids {
  constructor(numberOfAsteroids) {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.planes = this.experience.world.floors;

    this.numberOfAsteroids = numberOfAsteroids;
    this.asteroids = [];

    for (let i = 0; i < this.numberOfAsteroids; i++) {
      this.generateAsteroid();
    }

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("asteroids");
      this.debugFolder.close();
      this.setDebug();
    }
  }

  generateAsteroid() {
    const asteroid = new Asteroid();
    if (!asteroid.generated) return;

    // Saving for later
    this.asteroids.push(asteroid);
  }

  update() {
    this.asteroids.forEach((n, i) => {
      const asteroid = n.instance;
      const direction = i % 2 === 0 ? 1 : -1;

      //Asteroid
      n.updatePosition({
        x:
          direction *
          Math.cos(this.time.elapsed / 1000 / asteroid.scale.x) *
          5 *
          asteroid.scale.x *
          n.radius,
        y: asteroid.position.y,
        z:
          direction *
          Math.sin(this.time.elapsed / 1000 / asteroid.scale.z) *
          5 *
          asteroid.scale.z *
          n.radius,
      });
    });
  }

  setDebug() {
    const params = {};
    params.generateAsteroid = () => {
      this.generateAsteroid();
      this.numberOfAsteroids++;
    };

    params.deleteAsteroid = () => {
      if (this.asteroids.length === 0) return;
      this.asteroids[this.asteroids.length - 1].destroy();
      this.asteroids.pop();
    };

    params.printAsteroids = () => console.log(this.asteroids);

    this.debugFolder.add(params, "generateAsteroid");
    this.debugFolder.add(params, "printAsteroids");
    this.debugFolder.add(params, "deleteAsteroid");
  }
}
