//THe up and down arrows whent eh screen size is small.
//It essentially just takes the current visible tile and add or subtracks 1 on the href link
//Works similar to bubbles.
// the tiles all have ids of paddle-(index) so we can se that to make easy links

import styles from "./BubbleTilesController.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";


export const NextBack = ({ numberOfPaddles, visibleTile }) => {

  //Number of paddle is used to make sure we stay within 0 to length-1, visibleTile is the tile that is on scrren (at about top:35% on the screen)
  return (
    <div className={styles.nextBackButtonsContainer}>
      <a
        href={"#paddle-" + (visibleTile - 1 >= 0 ? visibleTile - 1 : visibleTile)}
        className={styles.svgContainers}
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
      >
        <FontAwesomeIcon
          className={styles.colorUIChangeIcon}
          icon={faAngleDoubleDown}
        />
      </a>
    </div>
  );
};
