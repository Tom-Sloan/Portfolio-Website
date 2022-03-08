import styles from "./Compass.module.css";

export function Compass({ compassValues }) {
  const getLocation = (angle) => {
    angle = angle + Math.PI / 2;
    if (angle < 0 || angle > Math.PI) {
      return {
        display: "none",
      };
    }
    angle /= Math.PI;
    const positionPercent = (1 - angle) * 95;
    return {
      left: `${positionPercent}%`,
    };
  };

  return (
    <div
      className={styles.CompassBarContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.emoteLeft}>🚀</div>

      {compassValues.map((n, compassElementIndex) => (
        <div
          key={"compassElement-" + compassElementIndex}
          className={styles.CompassBar}
          style={getLocation(n.angle)}
        >
          <div className={styles.emote}>{n.emoji}</div>
          <div className={styles.name}>{n.name}</div>
        </div>
      ))}
      <div className={styles.emoteRight}>🚀</div>
    </div>
  );
}
