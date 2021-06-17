import React from "react";
import styles from "./About.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { updateIndex } from './aboutSlice'

export function LeadBlock({
  index,
  title = "",
  numberOfPaddles,
  color,
  isSelected,
}) {
const dispatch = useDispatch()

  const diameter = 10;
  const middleIndex = Math.floor(numberOfPaddles / 2);
  const positionType = index < middleIndex ? 0 : index > middleIndex ? 2 : 1;
  const delta = Math.abs(middleIndex - index);

  const style = {
    backgroundColor: color,
    width: `${diameter}vh`,
    height: `${diameter}vh`,
    // left: [`calc(50% - ${15 * delta}vh)`, "50%", `calc(50% + ${15 * delta}vh)`][
    //   positionType
    // ],
    // top: "0",
    transform: isSelected?`translate3d(${0}, ${0}px, ${10 + "px"})`:`translate3d(${0}, ${0}px, ${0 + "px"})`,
  };
  // console.log(style.transform);
  //change the index if the paddle the user enter is not the one they were on
  const handleEnter = (e, index) => {
    dispatch(updateIndex({ index: index }));
  };

  return (
    <a href={"#paddle-" + index} onMouseEnter={(e) => handleEnter(e, index)} >
      <div style={style} className={styles.LeadBlock}>
      {/* {isSelected && (
          <div>
            <FontAwesomeIcon
              className={styles.downCheverons}
              icon={faAngleDoubleDown}
            />
          </div>
        )} */}
      </div>
    </a>
  );
}
