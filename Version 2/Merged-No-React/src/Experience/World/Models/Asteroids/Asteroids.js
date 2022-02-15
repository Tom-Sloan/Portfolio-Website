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
    this.speed = 0.001;
    this.lineVisibility = false;
    this.asteroidTotalCreated = 0;

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
    const asteroid = new Asteroid(
      this.speed,
      this.lineVisibility,
      this.asteroidTotalCreated
    );
    if (!asteroid.generated) return;

    // Saving for later
    this.asteroids.push(asteroid);
    this.asteroidTotalCreated++;
  }

  getAsteroidArrayMeshs() {
    return this.asteroids.map((n) => n.instance);
  }

  update() {
    this.asteroids.forEach((n) => n.update());
  }

  setDebug() {
    const params = {};
    params.generateAsteroid = () => {
      this.generateAsteroid();
      this.numberOfAsteroids++;
    };

    params.setSpeed = () =>
      this.asteroids.forEach((n) => (n.speed = this.speed));

    params.setLineVisibility = () =>
      this.asteroids.forEach((n) => (n.line.visible = this.lineVisibility));

    params.deleteAsteroid = () => {
      if (this.asteroids.length === 0) return;
      this.asteroids[this.asteroids.length - 1].destroy();
      this.asteroids.pop();
    };

    params.printAsteroids = () => console.log(this.asteroids);

    this.debugFolder.add(params, "generateAsteroid");
    this.debugFolder.add(params, "printAsteroids");
    this.debugFolder.add(params, "deleteAsteroid");
    this.debugFolder
      .add(this, "speed")
      .min(0.0005)
      .max(0.01)
      .step(0.001)
      .onChange(params.setSpeed);
    this.debugFolder
      .add(this, "lineVisibility")
      .onChange(params.setLineVisibility);
  }
}
