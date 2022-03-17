import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.deltaMS = 0.016;

    //This is so that tick is not called right away as that can set delta to 0
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  timeToRun(functionToTest, label) {
    label = label || "doSomething";
    const t0 = performance.now();
    functionToTest();
    const t1 = performance.now();
    console.log(`Call to ${label} took ${t1 - t0} milliseconds.`);
  }

  tick() {
    
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.deltaMS = this.delta / 1000;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
