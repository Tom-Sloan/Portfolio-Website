import styles from "./Compass.module.css";

export function Compass() {
  const getLocation = (angle) => {
    angle = angle + Math.PI / 2;
    if (angle < 0 || angle > Math.PI) {
      return {
        display: "none",
      };
    }
    angle /= Math.PI;
    const positionPercent = angle * 95;
    return {
      left: `${positionPercent}%`,
    };
  };
  const destination = [
    {
      name: "Projects",
      emoji: "⚒️",
      index: 0,
      angle: 0,
    },
    {
      name: "Resume",
      emoji: "📜",
      index: 1,
      angle: -Math.PI / 3,
    },
    {
      name: "Contact",
      emoji: "👨‍🔬",
      index: 1,
      angle: Math.PI / 6,
    },
  ];
  return (
    <div
      className={styles.CompassBarContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.emoteLeft}>🚀</div>
      {destination.map((n) => (
        <div className={styles.CompassBar} style={getLocation(n.angle)}>
          <div className={styles.emote}>{n.emoji}</div>
          <div className={styles.name}>{n.name}</div>
        </div>
      ))}
      <div className={styles.emoteRight}>🚀</div>
    </div>
  );
}
