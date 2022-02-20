import styles from "./Titlebar.module.css";

export function Titlebar({ destinations }) {
  const handleClick = (e, value) => {
    e.stopPropagation();
    window.tomsloanTeleportation = value;
    console.log(value);
  };
  return (
    <div id="titleHeader" className={styles.titleHeader}>
      {destinations.map((n, i) => {
        if (i === 0 || i === destinations.length - 1) {
          return (
            <div
              key={n.name + "titlebar-label"}
              className={`${styles.label}`}
              onClick={(e) => handleClick(e, n.index)}
            >
              {n.name}
            </div>
          );
        } else {
          return (
            <div
              key={n.name + "titlebar-label"}
              className={`${styles.label} ${styles.centerLabel}`}
              onClick={(e) => handleClick(e, n.index)}
            >
              {n.name}
            </div>
          );
        }
      })}
    </div>
  );
}
