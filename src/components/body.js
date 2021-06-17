import React from "react";
import styles from "./headerStyles.module.css";
import { AboutController } from "../features/About/AboutController";
import { Switch, Route } from "react-router-dom";
import { Home } from "../features/home/Home";
import { Projects } from "../features/projects/Projects";
import { Footer } from "./footerBar";
import { Resume } from "../features/resume/Resume";

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
          <AboutController />
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
