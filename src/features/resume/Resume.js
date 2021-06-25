// import styles from './Resume.module.css';
// import React, { useState } from 'react';
import { useEffect, useState } from "react";
import styles from "./Resume.module.css";
import {LinkedInTile} from '../linkedIn/LinkedInTile';

export function Resume() {
  const [resume, setResume] = useState("./Daniel_Neasmith_CV.pdf");
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const updateWindowDimensions = () => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  const handleClick = (e, input) => {
    if (input === "input1") {
      setResume("./Daniel_Neasmith_CV.pdf");
    } else {
      setResume("./Tom_Sloan_CV_Dec_2019.pdf");
    }
  };
  return (
    <div style={{ height: "fit-content" }}>
      {console.log({ dimensions })}
      <div>
        <LinkedInTile />
      </div>
      <div className={styles.radios}>
        <label for="input1" className={styles.label}></label>
        <input
          id="input1"
          className={`${styles.radioInput} ${styles.input1}`}
          name="radio"
          type="radio"
          onClick={(e) => handleClick(e, "input1")}
        />
        <label for="input2" className={styles.label}></label>
        <input
          id="input2"
          className={`${styles.radioInput} ${styles.input2}`}
          name="radio"
          type="radio"
          onClick={(e) => handleClick(e, "input2")}
        />
        <span className={styles.slider}></span>
      </div>
      <div style={{ textAlign: "center" }}>
        <object
          data={resume + "#zoom=90"}
          type="application/pdf"
          width="90%"
          height="1150px"
        >
          {/* <embed src='./Daniel_Neasmith_CV.pdf#zoom=100' type='application/pdf' height='10%' /> */}
          <p style={{ paddingTop: "30vh" }}>
            Oops! Your browser doesn't support PDFs!
          </p>
          <p>
            <a href={resume} target="_blank" rel="noreferrer">
              Download Instead
            </a>
          </p>
        </object>
      </div>
      {/* <h1>Resume</h1> */}
      {/* <iframe title='Resume' src='./Daniel_Neasmith_CV.pdf#zoom=100' width='90%' height='100%' ></iframe> */}
    </div>
  );
}
