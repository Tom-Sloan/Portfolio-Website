// import styles from './Resume.module.css';
// import React, { useState } from 'react';
import { useEffect, useState } from "react";
import styles from "./Resume.module.css";
import ToggleSwitch from "./LiquidSwitch/ToggleSwitch";
import { LiquidRadioButton } from "./LiquidSwitch/liquidRadioButton";
import { LinkedInTile } from '../linkedIn/LinkedInTile';
import React from 'react';
import { PDFReader } from 'react-read-pdf';
import { MobilePDFReader } from 'react-read-pdf';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import { Plugin, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { Experience } from "../experience/Experience";
import { setCSSGlobalVar } from '../../helpFunctions';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export function Resume() {
  const [resume, setResume] = useState("./Daniel_Neasmith_CV.pdf");
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const element = resume.slice(2, 8);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const updateWindowDimensions = () => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();
    setCSSGlobalVar('--rpv-core__inner-page-background-color', 'grey')

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  let [resumeToggle, setResumeToggle] = useState(false);

  const onResumeChange = (checked) => {
    setResumeToggle(checked);
    setResume(checked ? "./Tom_Sloan_CV_Dec_2019.pdf" : "./Daniel_Neasmith_CV.pdf")

  };
  useEffect(() => {
    const documentPages = document.querySelectorAll('.rpv-core__inner-page')
    console.log(documentPages)
  }, [resume])

  return (
    <div style={{ height: "fit-content" }}>
      <ToggleSwitch
        id="resumeToggle"
        checked={resumeToggle}
        onChange={onResumeChange}
        optionLabels={['Tom', 'Dan']}
      />
      <label htmlFor="resumeToggle" style={{ visibility: 'hidden' }}>Toggle 'tween resumes</label>
      <Experience human={resumeToggle ? 'tom' : 'dan'} />

      <div className={styles.pdfContainer}>
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
        {/* <a href={resume} download>Click here to download resume</a> */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js" >
          <div
            style={{
              height: '100%',
            }}
          >
            <Viewer fileUrl={resume} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      </div>
      {/* <h1>Resume</h1> */}
      {/* <iframe title='Resume' src='./Daniel_Neasmith_CV.pdf#zoom=100' width='90%' height='100%' ></iframe> */}
    </div>
  );
}
