// import styles from './Resume.module.css';
// import React, { useState } from 'react';
import { useEffect, useState, useContext } from "react";
import styles from "./Resume.module.css";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
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
import { NameContext } from "../../AllContexts";

export function Resume() {
  const name = useContext(NameContext).personName;
  console.log('name: ', name)
  const [resume, setResume] = useState();
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  // const element = resume.slice(2, 8);

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


  useEffect(() => {
    const documentPages = document.querySelectorAll('.rpv-core__inner-page')
    console.log(documentPages)
  }, [resume])

  return (
    <div style={{ height: "fit-content" }}>
      
      <Experience human={name ==='tom' ? 'tom' : 'dan'} />

      <div className={styles.pdfContainer}>
        
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js" >
          <div
            style={{
              height: '100%',
            }}
          >
            <Viewer fileUrl={name==='tom'? "./resumes/Tom_Sloan_CV_Dec_2019.pdf" : "./resumes/Daniel_Neasmith_CV.pdf"} plugins={[defaultLayoutPluginInstance]} />
          </div>
        </Worker>
      </div>
     
    </div>
  );
}
