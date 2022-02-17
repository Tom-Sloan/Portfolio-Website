import { useCallback, useEffect, useRef, useState } from "react";
import Experience from "./Experience/Experience.js";
import { Information } from "../Information/Information.js";

export function World() {
  const domReference = useRef();
  const matterReference = useRef();
  const [popUpState, setPopUpState] = useState(false);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const experience = new Experience(
      domReference.current,
      matterReference.current,
      callback
    );
  }, []);

  const onClickHandler = (e) => {
    if (popUpState) {
      e.stopPropagation();
      setPopUpState(false);
    }
  };

  const callback = (event) => {
    console.log("React: ", event.charAt(event.length - 1), event);
    setCurrent(event.charAt(event.length - 1));
    setPopUpState(true);
  };

  return (
    <div onClick={onClickHandler}>
      {popUpState && <Information current={current} />}
      <canvas className="worldContainer" ref={domReference} />
      <canvas ref={matterReference} />
    </div>
  );
}
