import { Projects } from "./Projects";
import styles from "./Information.module.css";
import { Contact } from "./Contact";
import { Resume } from "./Resume/Resume";
export function Information({ current }) {
  let element = <div></div>;
  console.log(current);
  if (current === "0") {
    element = <Resume />;
  } else if (current === "1") {
    element = <Resume />;
  } else if (current === "2") {
    element = <Resume />;
  }
  return (
    <div className={styles.modal}>
      <div className={styles.modal_container}>
        <div className={styles.modal_content}>{element}</div>
      </div>
    </div>
  );
}
