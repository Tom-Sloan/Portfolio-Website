import React from "react";
import styles from "./headerStyles.module.css";
import { BubbleTiles } from "./BubbleTiles/BubbleTiles";
import { Switch, Route } from "react-router-dom";
import { Home } from "../features/home/Home";
import { Projects } from "../features/projects/Projects";
import { Footer } from "./footerBar";
import { Resume } from "../features/resume/Resume";
import {TestData} from '../features/About/AboutTestOption';

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
          <BubbleTiles titles={bubbleTiles.titles} components={bubbleTiles.components} colors={bubbleTiles.colors} offset={bubbleTiles.offset}/>
        </Route>
        <Route path="/projects">
          <div className={styles.parallaxParent}>
            <div className={styles.parallax}></div>
            <Projects />
            <Footer />
          </div>
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


const bubbleTiles = {
  titles: [
    "Personal",
    "Artist",
    "Music",
    "Personal",
    "Artist",
  ],

  components:[
    <TestData numberOfRepeat={3} />,
    <TestData numberOfRepeat={4} />,
    <TestData numberOfRepeat={3} />,
    <TestData numberOfRepeat={2} />,
    <TestData numberOfRepeat={5} />,

  ],

  colors: [
    "#006a4e",
    "#2e856e",
    "#5ca08e",
    "#8abaae",
    "#b8d5cd",
  ],

  offset: 40,

}