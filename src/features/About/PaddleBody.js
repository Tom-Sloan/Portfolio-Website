/*
PaddleJs is made up of two parts:
1. The stylized svgs that lead into the content and act like fancy tabs
2. The body components that contain the relevant information

The body components are stacked whereas the svgs are designed to be in a grid format but look statcked 
*/

import React from "react";
import styles from "./About.module.css";
import { TestData } from "./AboutTestOption";

export function PaddleBody({
  elm,
  index,
  numberOfPaddles,
  position,
  transform,
}) {
  const activeDivStyle = {
    backgroundColor: elm.color,
  };

  const titleLocation = {
    width: !(position % 2) ? "100%" : "0",
  };
  return (
    <div
      id={"paddle-" + index}
      className={`${styles.content}`}
      style={transform}
    >
      <h2 style={titleLocation} className={styles.labelTexts}>
        {elm.title}
      </h2>

      <div className={styles.contentContainer} style={activeDivStyle}>
        <div className={styles.subheading}>
          Adipisicing ea officia commodo deserunt officia excepteur cupidatat.
        </div>
        <TestData numberOfRepeat={index + 1} />
      </div>
    </div>
  );
}
