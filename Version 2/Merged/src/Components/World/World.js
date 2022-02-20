import { useEffect, useRef, useState } from "react";
import Experience from "./Experience/Experience.js";
import { Information } from "../Information/Information.js";
import { Compass } from "../Compass/Compass";

export function World({ destinations }) {
  const domReference = useRef();
  const matterReference = useRef();
  const [popUpState, setPopUpState] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    window.tomsloanTeleportation = -1;
    const experience = new Experience(
      domReference.current,
      matterReference.current,
      callback,
      destinations
    );
  }, []);

  const onClickHandler = (e) => {
    if (popUpState) {
      e.stopPropagation();
      setPopUpState(false);
    }
  };

  const callback = (event) => {
    if (event.type === "compassUpdate") {
    } else if (event.type === "pageView") {
      setCurrent(event.index);
      setPopUpState(true);
    }
  };

  return (
    <div onClick={onClickHandler}>
      {popUpState && <Information current={current} />}
      <canvas className="worldContainer" ref={domReference} />
      <canvas className="matterContainer" ref={matterReference} />
      <Compass />
    </div>
  );
}
