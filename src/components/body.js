import React from "react";
import styles from "./headerStyles.module.css";
import { AboutRoute } from "../features/About/AboutRoute";
import { Switch, Route, Link } from "react-router-dom";
import { Home } from "../features/home/Home";
import { Projects, handleScroll } from "../features/projects/Projects";
import { Footer } from "./footerBar";

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
          <AboutRoute />
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
            <Home />
            <Footer />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

function Resume() {
  return (
    <div>
      <h2>Resume</h2>
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
