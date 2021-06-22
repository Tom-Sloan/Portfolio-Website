import styles from "./BubbleTilesController.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export const NextBack = ({ numberOfPaddles }) => {
  const [tileNumber, setTileNumber] = useState(0);
  
  const handleClick = (e, direction) => {
    // console.log(document.querySelector(`.${styles.nextBackButtonsContainer}`));
    if (direction === "up") {
      setTimeout(
        () => setTileNumber((prev) => (prev - 1 >= 0 ? prev - 1 : prev)),
        10
      );
    } else if (direction === "down") {
      setTimeout(
        () =>
          setTileNumber((prev) =>
            prev + 1 < numberOfPaddles ? prev + 1 : prev
          ),
        10
      );
    }

  };


  return (
    <div className={styles.nextBackButtonsContainer}>
      <a
        href={"#paddle-" + (tileNumber - 1 >= 0 ? tileNumber - 1 : tileNumber)}
        className={styles.svgContainers}
        onMouseUp={(e) => handleClick(e, "up")}
      >
        <FontAwesomeIcon
          className={styles.colorUIChangeIcon}
          icon={faAngleDoubleUp}
        />
      </a>
      <a
        href={"#paddle-" + (tileNumber + 1 < numberOfPaddles ? tileNumber + 1 : tileNumber)}
        className={styles.svgContainers}
        onMouseUp={(e) => handleClick(e, "down")}
      >
        <FontAwesomeIcon
          className={styles.colorUIChangeIcon}
          icon={faAngleDoubleDown}
        />
      </a>
    </div>
  );
};
