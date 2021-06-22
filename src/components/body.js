import React from "react";
import styles from "./headerStyles.module.css";
import { BubbleTiles } from "./BubbleTiles/BubbleTiles";
import { Switch, Route } from "react-router-dom";
import { Home } from "../features/home/Home";
import { ProjectsContainer } from "../features/projects/ProjectsContainer";
import { Footer } from "./footerBar";
import { Resume } from "../features/resume/Resume";
import { TestData } from "../features/About/AboutTestOption";


export function Body() {
  
  return (
    <div className={styles.bodyArea}>
      <Switch>
        <Route exact path="/">
          <div className={styles.parent}>
            <Home />
            <Footer />
          </div>
        </Route>
        <Route path="/about">
          <BubbleTiles visualData={bubbleTilesInitial} />
        </Route>
        <Route path="/projects">
          <ProjectsContainer />
        </Route>
        <Route path="/resume">
          <div className={styles.parent}>
            <Resume />
            <Footer />
          </div>
        </Route>
        <Route path="/contact">
          <div className={styles.parent}>
            <Contact />
            <Footer />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h2>Contact</h2>
    </div>
  );
}

const bubbleTilesInitial = {
  displayData: [
    {
      title: "Personal",
      component: <TestData numberOfRepeat={3} />,
      color: "#006a4e",
    },
    {
      title: "Artist",
      component: <TestData numberOfRepeat={3} />,
      color: "#2e856e",
    },
    {
      title: "Music",
      component: <TestData numberOfRepeat={3} />,
      color: "#5ca08e",
    },
    {
      title: "Personal",
      component: <TestData numberOfRepeat={3} />,
      color: "#8abaae",
    },
    {
      title: "Artist",
      component: <TestData numberOfRepeat={3} />,
      color: "#b8d5cd",
    },
  ],
};
