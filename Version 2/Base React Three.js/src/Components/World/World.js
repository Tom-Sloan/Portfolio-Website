import { useEffect, useRef } from "react";
import { init } from "./init";
import Experience from "./Experience/Experience.js";

export function World() {
  const domReference = useRef();
  useEffect(() => {
    const experience = new Experience(domReference);
    // init(domReference);
  }, []);

  return <canvas className="worldContainer" ref={domReference} />;
}
