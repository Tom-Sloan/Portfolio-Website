import styles from "./BubbleTilesController.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";


export const NextBack = ({ numberOfPaddles, visibleTile }) => {

  return (
    <div className={styles.nextBackButtonsContainer}>
      <a
        href={"#paddle-" + (visibleTile - 1 >= 0 ? visibleTile - 1 : visibleTile)}
        className={styles.svgContainers}
        // onMouseUp={(e) => handleClick(e, "up")}
      >
        <FontAwesomeIcon
          className={styles.colorUIChangeIcon}
          icon={faAngleDoubleUp}
        />
      </a>
      <div className={styles.displayNumber}>{visibleTile+1}</div>
      <a
        href={"#paddle-" + (visibleTile + 1 < numberOfPaddles ? visibleTile + 1 : visibleTile)}
        className={styles.svgContainers}
        // onMouseUp={(e) => handleClick(e, "down")}
      >
        <FontAwesomeIcon
          className={styles.colorUIChangeIcon}
          icon={faAngleDoubleDown}
        />
      </a>
    </div>
  );
};
