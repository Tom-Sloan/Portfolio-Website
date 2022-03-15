// import styles from './Resume.module.css';
// import React, { useState } from 'react';
import { useEffect, useState, useContext } from "react";
import styles from "./Resume.module.css";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";
import { LiquidRadioButton } from "./LiquidSwitch/liquidRadioButton";
import { LinkedInTile } from "../linkedIn/LinkedInTile";
import React from "react";
import { PDFReader } from "react-read-pdf";
import { MobilePDFReader } from "react-read-pdf";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { Plugin, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { Experience } from "../experience/Experience";
import { setCSSGlobalVar } from "../../helpFunctions";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { NameContext } from "../../AllContexts";
import "./backgroundStyles.scss";

export function Resume() {
  const apiUrl = "https://ssn1hpic18.execute-api.us-east-1.amazonaws.com/demo";
  const name = useContext(NameContext).personName;
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
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
  const getResume = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(apiUrl, requestOptions);
    const responseJSON = await response.json();

    requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const resumeResponse = await fetch(responseJSON, requestOptions);

    const data = await resumeResponse.blob();

    const fileURL = window.URL.createObjectURL(data);
    setResumeFileUrl(fileURL);
  };

  function download(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    // the filename you want
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  useEffect(() => {
    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();
    setCSSGlobalVar("--rpv-core__inner-page-background-color", "grey");

    getResume();

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    const documentPages = document.querySelectorAll(".rpv-core__inner-page");
  }, [resume]);

  return (
    <div className={`${styles.resumeParent} resumeParent`}>
      <Experience human={name === "tom" ? "tom" : "dan"} />

      <div className={styles.pdfContainer}>
        {resumeFileUrl && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.2.228/build/pdf.worker.min.js">
            <div
              style={{
                height: "100%",
              }}
            >
              <Viewer
                fileUrl={resumeFileUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
          </Worker>
        )}
      </div>
    </div>
  );
}
