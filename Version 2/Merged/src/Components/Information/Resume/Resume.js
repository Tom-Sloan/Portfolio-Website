import { useEffect, useState, useContext } from "react";
import styles from "./Resume.module.css";
import React from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
// import { Experience } from "../experience/Experience";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Experience } from "./Experience";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export function Resume() {
  // const [resume, setResume] = useState();
  // const [dimensions, setDimensions] = useState({
  //   height: window.innerHeight,
  //   width: window.innerWidth,
  // });
  // const element = resume.slice(2, 8);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // const updateWindowDimensions = () => {
  //   setDimensions({
  //     height: window.innerHeight,
  //     width: window.innerWidth,
  //   });
  // };
  // const setCSSGlobalVar = (name, value) =>
  //   document.documentElement.style.setProperty(name, value);
  // useEffect(() => {
  //   window.addEventListener("resize", updateWindowDimensions);
  //   updateWindowDimensions();
  //   setCSSGlobalVar("--rpv-core__inner-page-background-color", "grey");

  //   return () => window.removeEventListener("resize", updateWindowDimensions);
  // }, []);

  // useEffect(() => {
  //   const documentPages = document.querySelectorAll(".rpv-core__inner-page");
  //   console.log(documentPages);
  // }, [resume]);

  return (
    <div className={styles.parent} onClick={(e) => e.stopPropagation()}>
      {/* <Experience /> */}
      <a
        target="_blank"
        download="./resumes/Tom_Sloan_CV_Jan_2022.pdf"
        href="/"
        className={styles.downloadLink}
      >
        <button className={styles.btnDownload}>
          <FontAwesomeIcon icon={faDownload} className={styles.helpIcon} />
        </button>
      </a>
      <div className={styles.pdfContainer}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
          <Viewer
            fileUrl={"./resumes/Tom_Sloan_CV_Jan_2022.pdf"}
            // plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>
    </div>
  );
}
