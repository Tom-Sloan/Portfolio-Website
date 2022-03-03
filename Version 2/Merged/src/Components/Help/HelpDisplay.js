import styles from "./HelpDisplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faComputerMouse,
  faW,
} from "@fortawesome/free-solid-svg-icons";

export function HelpDisplay() {
  const instructions = [
    {
      icon: faW,
      text: "Press W to change camera view",
    },
    {
      icon: faComputerMouse,
      text: "Use the left mouse button to move and select an information pane",
    },
  ];
  return (
    <div className={styles.helpContainer} onClick={(e) => e.stopPropagation()}>
      <FontAwesomeIcon icon={faCircleQuestion} className={styles.helpIcon} />
      <div className={styles.instructions}>
        {instructions &&
          instructions.map((n) => (
            <div className={styles.instructionElementContainer}>
              <div className={styles.instructionIcon}>
                <FontAwesomeIcon icon={n.icon} />
              </div>
              <div className={styles.instructionText}>{n.text}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
