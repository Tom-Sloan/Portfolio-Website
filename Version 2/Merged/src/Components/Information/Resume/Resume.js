import { useEffect, useState, useContext } from "react";
import styles from "./Resume.module.css";
import React from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
// import { Experience } from "../experience/Experience";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

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
    <div className={styles.resumeParent}>
      {/* <Experience human={name === "tom" ? "tom" : "dan"} /> */}

      <div className={styles.pdfContainer}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
          <div
            style={{
              height: "100%",
            }}
          >
            <Viewer
              fileUrl={"./resumes/Tom_Sloan_CV_Dec_2019.pdf"}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      </div>
    </div>
  );
}
