import { useEffect, useRef, useState } from "react";
import Experience from "./Experience/Experience.js";
import { Information } from "../Information/Information.js";
import { Compass } from "../Compass/Compass";
import { HelpDisplay } from "../Help/HelpDisplay.js";

export function World({ destinations, isLoading, setIsLoading }) {
  const domReference = useRef();
  const matterReference = useRef();
  const [popUpState, setPopUpState] = useState(false);
  const [current, setCurrent] = useState(0);
  const [compassValues, setCompassValues] = useState([]);
  const [helpDisplayState, setHelpDisplayState] = useState(true);


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
    console.log("here clicking");
    if (helpDisplayState) {
      console.log("setting to false");
      setHelpDisplayState(false);
    }
    if (popUpState) {
      e.stopPropagation();
      setPopUpState(false);
    }
  };

  const callback = (event) => {
    if (!event) {
      setIsLoading(false);
    } else {
      if (event.type === "compassUpdate") {
        let temp = event.data.map((n) => ({
          ...destinations[n.index],
          angle: n.angle,
        }));

        setCompassValues(temp);
      } else if (event.type === "pageView") {
        setCurrent(event.index);
        setPopUpState(true);
      }
    }
  };

  return (
    <div onClick={onClickHandler}>
      {popUpState && <Information current={current} />}
      <canvas className="worldContainer" ref={domReference} />
      <canvas className="matterContainer" ref={matterReference} />
      <Compass compassValues={compassValues} />
      <HelpDisplay isLoading={isLoading} display={helpDisplayState} />
    </div>
  );
}
