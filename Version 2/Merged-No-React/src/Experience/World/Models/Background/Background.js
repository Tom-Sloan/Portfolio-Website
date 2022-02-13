import Galaxy from "./Galaxy";
import Stars from "./stars";

export default class Background {
  constructor() {
    this.galaxy = new Galaxy();
    this.stars = new Stars()
  }
  update() {
    if (this.galaxy) this.galaxy.update();
  }
}
