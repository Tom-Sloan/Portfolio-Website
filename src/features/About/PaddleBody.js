/*
PaddleJs is made up of two parts:
1. The stylized svgs that lead into the content and act like fancy tabs
2. The body components that contain the relevant information

The body components are stacked whereas the svgs are designed to be in a grid format but look statcked 
*/

import React from "react";
import styles from "./About.module.css";
import { useDispatch } from "react-redux";
import { updateIndex } from "./aboutSlice";
import { TestData } from "./AboutTestOption";

export function PaddleBody({ elm, zIndex, index, numberOfPaddles }) {
  const dispatch = useDispatch();
  const offset = 1.5;
  const activeDivStyle = {
    width: 100 - (numberOfPaddles - 1)  * offset + '%',
    backgroundColor: elm.color,
    zIndex: zIndex,
    left: index * offset + "%",
    cursor: zIndex === numberOfPaddles ? "default" : "pointer",
    borderRadius:
      index === 0
        ? "0 100px 100px 100px"
        : index === numberOfPaddles - 1
        ? "100px 0 100px 100px"
        : "100px",
  };

  const handleClick = (e) => {
    //not do anything if currently the top one
    if (zIndex !== numberOfPaddles) {
      dispatch(updateIndex({ index: index }));
    }
  };

  return (
    <div
      onClick={handleClick}
      className={styles.content}
      style={activeDivStyle}
    >
      <TestData />
      {index === 2 && <TestData />}
    </div>
  );
}
