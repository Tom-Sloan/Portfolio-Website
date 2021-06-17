/*
PaddleJs is made up of two parts:
1. The stylized svgs that lead into the content and act like fancy tabs
2. The body components that contain the relevant information

The body components are stacked whereas the svgs are designed to be in a grid format but look statcked 
*/

import React from "react";
import styles from "./About.module.css";
import { TestData } from "./AboutTestOption";

export function PaddleBody({ elm, index, numberOfPaddles, position, transform }) {
  const offset = 1.5;

  const activeDivStyle = {
    width: "60%",
    backgroundColor: elm.color,    
  };
  for(const [key, value] of Object.entries(transform))
    activeDivStyle[key] = value
  
  const visibility = {
    opacity: position !== numberOfPaddles ? "0" : "1",
    transition: "opacity 1.25s",
  };
  const positionType =
  index === 0 ? 0 : index === numberOfPaddles - 1 ? 2 : 1;
  const textTypes = ['left', 'center', 'right'];
  const subheadingStyle={
    textAlign: textTypes[positionType]
  }
  return (
    <div
      id={"paddle-" + index}
      className={`${styles.content}`}
      style={activeDivStyle}
    >
      <div className={styles.contentContainer} >
        <div className={styles.subheading} style={subheadingStyle}>
          Adipisicing ea officia commodo deserunt officia excepteur cupidatat.
        </div>
        <TestData/>
      </div>
    </div>
  );
}
