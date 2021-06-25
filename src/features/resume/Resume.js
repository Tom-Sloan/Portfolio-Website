// import styles from './Resume.module.css';
// import React, { useState } from 'react';
import { useEffect, useState } from "react";
import styles from "./Resume.module.css";
import { LinkedInTile } from '../linkedIn/LinkedInTile';
import React from 'react';
import { PDFReader } from 'react-read-pdf';
import { MobilePDFReader } from 'react-read-pdf';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Experience } from "../experience/Experience";

export function Resume() {
  const [resume, setResume] = useState("./Daniel_Neasmith_CV.pdf");
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const element = resume.slice(2, 8);

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
      // element = 'Daniel';
      // console.log(resume)
    } else {
      setResume("./Tom_Sloan_CV_Dec_2019.pdf");
      // element = 'Thomas';
      // console.log(resume)
    }
  };

  useEffect(() => {
    console.log(resume)
    console.log(element)
  }, [resume])

  return (
    <div style={{ height: "fit-content" }}>
      <Experience />
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
        {/* <object
          data={resume + "#zoom=90"}
          type="application/pdf"
          width="90%"
          height="1150px"
        >
          <p style={{ paddingTop: "30vh" }}>
            Oops! Your browser doesn't support PDFs!
          </p>
          <p>
            <a href={resume} target="_blank" rel="noreferrer">
              Download Instead
            </a>
          </p>
        </object> */}
        {/* <embed src='./Daniel_Neasmith_CV.pdf#zoom=100' type='application/pdf' height='10%' /> */}
        {/* <div className={element}>
          <PDFReader className={styles.dan} showAllPage='true' url="./Daniel_Neasmith_CV.pdf" />
          <br/>
          <PDFReader className={styles.tom} showAllPage='true' url="./Tom_Sloan_CV_Dec_2019.pdf" />
        </div> */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js" >
          <Viewer fileUrl={resume} />
        </Worker>
      </div>
      {/* <h1>Resume</h1> */}
      {/* <iframe title='Resume' src='./Daniel_Neasmith_CV.pdf#zoom=100' width='90%' height='100%' ></iframe> */}
    </div>
  );
}
