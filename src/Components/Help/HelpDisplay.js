import styles from "./HelpDisplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faComputerMouse,
  faW,
  faTag,
  faCompass,
  faMeteor,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export function HelpDisplay({ display, isLoading }) {
  const [style, setStyle] = useState({
    opacity: 1,
  });

  const instructions = [
    // {
    //   icon: faW,
    //   text: "Press W to change camera view",
    // },
    {
      icon: faCircleQuestion,
      text: "Hover over the question mark at the top right corner for help",
    },
    {
      icon: faCompass,
      text: "To navigate to a location, use the compass bar at the top for direction",
    },
    {
      icon: faComputerMouse,
      text: "Use the left mouse button to move and to select an information pane",
    },
    {
      icon: faTag,
      text: "Click on a label at the bottom to move straight to that location",
    },
    {
      icon: faMeteor,
      text: "Asteroids have no click function, they only react on collisions",
    },
  ];

  return (
    <div className={styles.helpContainer}>
      <FontAwesomeIcon icon={faCircleQuestion} className={styles.helpIcon} />
      <div className={styles.instructions} style={display ? style : {}}>
        {instructions &&
          instructions.map((n) => (
            <div className={styles.instructionElementContainer}>
              <div className={styles.instructionIcon}>
                <FontAwesomeIcon icon={n.icon} />
              </div>
              <div className={styles.instructionText}>{n.text}</div>
            </div>
          ))}
        {isLoading && (
          <div className={styles.loadingBarContainer}>
            <div className="loadingBar"></div>
          </div>
        )}
        {!isLoading && display && (
          <div className={styles.postText} style={{ "text-align": "center" }}>
            Click anywhere to close the help box
          </div>
        )}
      </div>
    </div>
  );
}
