import React from "react";
import styles from "./About.module.css";
import { useDispatch } from "react-redux";
import { updateIndex } from "./aboutSlice";

export function LeadBlock({
  index,
  title = "",
  numberOfPaddles,
  color,
  isSelected,
  toggleAnimation,
  OnScreen,
}) {
  const dispatch = useDispatch();

  const diameter = 10;
  const middleIndex = Math.floor(numberOfPaddles / 2);
  const positionType = index < middleIndex ? 0 : index > middleIndex ? 2 : 1;
  const delta = Math.abs(middleIndex - index);
  let transform = "";
  if (toggleAnimation) {
    transform = OnScreen ? `scale(1.25)` : "";
  } else {
    transform = isSelected ? `scale(1.25)` : `scale(1)`;
  }

  const style = {
    backgroundColor: color,
    width: `${diameter}vh`,
    height: `${diameter}vh`,
    left: !toggleAnimation
      ? [`calc(50% - ${15 * delta}vw)`, "50%", `calc(50% + ${15 * delta}vw)`][
          positionType
        ]
      : "10%",
    top: toggleAnimation
      ? `calc(40px + ${diameter * index}vh + ${2 * index}vh)`
      : "40px",
    transform: transform,
    transition: toggleAnimation
      ? "transform 0.2s ease-out, top 0.6s ease-out 0.6s, left 0.6s ease-out"
      : "transform 0.2s ease-out, top 0.6s ease-out, left 0.6s ease-out 0.6s",
  };
  // console.log(style.transform);
  //change the index if the paddle the user enter is not the one they were on
  const handleEnter = (e, index) => {
    if (!toggleAnimation) dispatch(updateIndex({ index: index }));
  };

  return (
    <a href={"#paddle-" + index} onMouseEnter={(e) => handleEnter(e, index)}>
      <div style={style} className={styles.LeadBlock}>
        <p>{title}</p>
      </div>
    </a>
  );
}
