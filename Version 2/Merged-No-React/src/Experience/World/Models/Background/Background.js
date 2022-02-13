import Galaxy from "./Galaxy";
import Particles from "./Particles";

export default class Background {
  constructor() {
    // this.galaxy = new Galaxy();
    this.particles = new Particles();
  }
  update() {
    if (this.galaxy) this.galaxy.update();
  }
}
