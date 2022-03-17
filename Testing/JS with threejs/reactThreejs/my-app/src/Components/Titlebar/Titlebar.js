import styles from "./Titlebar.module.css";

export function Titlebar() {
  const handleClick = (e, value) => {
    e.preventDefault();
    console.log(value);
  };
  return (
    <div id="titleHeader" className={styles.titleHeader}>
      <div className={`${styles.label}`} onClick={(e) => handleClick(e, 0)}>
        Projects
      </div>
      <div
        className={`${styles.label} ${styles.centerLabel}`}
        onClick={(e) => handleClick(e, 1)}
      >
        Resume
      </div>
      <div className={`${styles.label}`} onClick={(e) => handleClick(e, 2)}>
        Contact Me
      </div>
    </div>
  );
}
