import React from "react";
import styles from "./BodyStyles.module.css";
import { BubbleTiles } from "./BubbleTiles/BubbleTiles";
import { Switch, Route } from "react-router-dom";
import { Home } from "../features/home/Home";
import { ProjectsContainer } from "../features/projects/ProjectsContainer";
import { Footer } from "./FooterBar/footerBar";
import { ResumeContainer } from "../features/resume/ResumeContainer";
import { TestData } from "../features/About/AboutTestOption.js";
import { Contact } from "../features/contact/Contact";
import { Playlists } from "../features/Spotify/Playlists";
import { useSelector } from "react-redux";
import { selectSportsArray } from "../features/general/generalSlice";
import { General } from "../features/general/General";
import { Photos } from "../features/About/photos/Photos";
import { UnderConstruction } from "./UnderConstruction/underconstruction";

export function Body({ personeName }) {
  const underconstruction = false;
  return (
    <div className={styles.bodyArea}>
      <Switch>
        <Route exact path="/">
          <div id="HomeParentContainer" className={styles.parent}>
            <Home />
            <Footer />
          </div>
        </Route>
        <Route path="/about">
          {(underconstruction && <UnderConstruction />) || (
            <BubbleTiles visualData={bubbleTilesInitial} />
          )}
        </Route>
        <Route path="/projects">
          <ProjectsContainer />
        </Route>
        <Route path="/resume">
          <ResumeContainer />
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

const bubbleTilesInitial = {
  name: "Body",
  displayData: [
    {
      title: "Music",
      component: <Playlists />,
      color: "#006a4e",
    },
    {
      title: "Sports",
      component: <General choice="sports" />,
      color: "#2e856e",
    },
    {
      title: "Personal",
      component: <General choice="personals" />,
      color: "#5ca08e",
    },
    {
      title: "Personal",
      component: <Photos />,
      color: "#8abaae",
    },
    // {
    //   title: "Artist",
    //   component: <TestData numberOfRepeat={3} />,
    //   color: "#F5BF51",
    // },
  ],

  // colors: [
  //   "#006a4e",
  //   "#2e856e",
  //   "#5ca08e",
  //   "#8abaae",
  //   "#b8d5cd",
  // ],

  colors: ["#66023C", "#992B43", "#C45744", "#E38946", "#F5BF51"],

  // colors: [
  //   "#5F8277",
  //   "#5F7F7F",
  //   "#657C82",
  //   "#6D787F",
  //   "#575A5E",
  // ],
  hasHorizontal: false,
  offset: 20,
};
