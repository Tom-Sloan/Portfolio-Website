import * as dat from "lil-gui";

export default class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.ui = new dat.GUI();
      // this.ui.close();

      // Get the dom element of the lil gui gui
      this.element = this.ui.domElement;
      //, "dblclick", "mouseup", "mousedown"
      this.events = ["click"]; // mouse events to block
      this.bindEventsToSameHandler(this.element, this.events, function (e) {
        e.stopPropagation();
      });
    }
  }
  bindEventsToSameHandler(element, events, handler) {
    for (var i = 0; i < events.length; i++) {
      element.addEventListener(events[i], handler);
    }
  }
}
