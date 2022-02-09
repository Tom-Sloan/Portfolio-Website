import { useEffect, useRef } from "react";
import { init } from "./init";

export function World() {
  const domReference = useRef();
  useEffect(() => {
    init(domReference);
  }, []);

  return <canvas className="worldContainer" ref={domReference} />;
}

// const addDebugConsole = (parameters) => {
//   const gui = new dat.GUI();
//   gui.addColor(parameters, "materialColor").onChange(() => {
//     material.color.set(parameters.materialColor);
//     particlesMaterial.color.set(parameters.materialColor);
//   });
// };
