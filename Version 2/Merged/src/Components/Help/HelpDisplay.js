import styles from "./HelpDisplay.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

export function HelpDisplay() {
  const instructions = [
    {
      icon: "",
      text: "",
    },
    {
      icon: "",
      text: "",
    },
  ];
  return (
    <div className={styles.helpContainer}>
      <FontAwesomeIcon icon={faCircleQuestion} />
      <div className={styles.instructions}></div>
    </div>
  );
}
