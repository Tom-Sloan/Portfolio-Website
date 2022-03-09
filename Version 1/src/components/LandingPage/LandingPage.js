/* 
Landing page

This is the location of first arrival for people who visit the site. On mobile, it will not display

The goal of this page is to provide a unique way to move about a website, demonstraing our ability to learn new things.

There is an alternative way to view the site if the user wishes

*/

import { useRef, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import World from "./World";
import landingPageStyles from "./LandingPage.module.css";
import { BubbleTiles } from "../BubbleTiles/BubbleTiles";
import { TestData } from "../../features/About/AboutTestOption";
import { ResumeContainer } from "../../features/resume/ResumeContainer";
import { ProjectsContainer } from "../../features/projects/ProjectsContainer";

export function LandingPage() {
  //Reference to landing page. This is usef for knowing how far to scroll App to get to the 'standard' site, and for the canvas of matter.js to attach to it
  const landingPageRef = useRef(null);
  const matterDiv = useRef(null);

  //Contains the instance of world. world is set to null when the engine is destroyed
  const [world, setWorld] = useState();

  //used to change the location of react router without loading a new page
  const history = useHistory();

  //Contains the elme that is inside the popup
  const [currentlyDisplayed, setCurrentDisplayed] = useState(null);

  //Reference for the popup, used to toogle visibility
  const popUpReference = useRef(null);

  
  //Gets the height of the landing page, returns 0 if it doesn't / no longer exists
  const landingpageHeight = (lable = "resize") => {

    return (
      (landingPageRef &&
        landingPageRef.current &&
        landingPageRef.current.clientHeight) ||
      0
    );
  };

  //Contians the use effect that runs at the start
  useEffect(() => {
    //Starts the inital world world
    startWorld();

    //Function to call on resize
    const deboucedUpdateWindowDimensions = debounce(
      updateWindowDimensions,
      1000
    );

    //Add window resize listener, this is so the user doesn't get stuck halfway between the standard site and the landingpage
    window.addEventListener("resize", deboucedUpdateWindowDimensions);

    //Add scroll listener. This is to restart the world when the user gets to the top
    document
      .querySelector(".App")
      .addEventListener("scroll", handleRestart, { passive: true });

    //Cleanup for the scroll listener and the resize listener
    return () => {
      window.removeEventListener("scroll", handleRestart);
      window.removeEventListener("resize", deboucedUpdateWindowDimensions);
    };
  }, []);

  //function that gets toggled on window resize
  const updateWindowDimensions = () => {
    //If the user was previously on the landing page, put them back there, else send em to the standard site
    if (world) {
      document.querySelector(".App").scrollTo(0, 0);
    } else {
      const app = document.querySelector(".App");
      const _ = app.scrollTop > landingpageHeight() * 0.6 ? app.scrollTo(0, landingpageHeight("stoping")): app.scrollTo(0, 0);
      console.log("scrolling");
      stopWorld("resize");
    }
  };

  //function that gets the desired deboucing to work for on window resize
  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  //Function called when a user clicks on one of the circles in the cloth
  const handleButtonPress = (destination = "home") => {
    history.push(destination);

    if (destination === "about") {
      setCurrentDisplayed(<BubbleTiles visualData={bubbleTilesInitial} />);
    } else if (destination === "projects") {
      setCurrentDisplayed(<ProjectsContainer />);
    } else if (destination === "resume") {
      setCurrentDisplayed(<ResumeContainer />);
    } else {
      setCurrentDisplayed(<BubbleTiles visualData={bubbleTilesInitial} />);
    }

    popUpReference.current.classList.toggle(landingPageStyles.modal);
  };

  //Function called to start the world up again when the user gets back to the landing page
  const handleRestart = ({ target }) => {
    if (!target.scrollTop) {
      console.log('at the top')
      // startWorld();
    }
  };

  //Function called to close popup
  const closePopUp = (e) => {
    popUpReference.current.classList.remove(landingPageStyles.modal);
  };

  //Stops the world
  const stopWorld = (label = "wheele") => {
    console.log(label, "here");
    console.log(world)
    //Scrolls the user down to the standard site
    document.querySelector(".App").scrollTo(0, landingpageHeight("stoping"));
    //stop the world instance if there is one. There is a delay before it happens so the user doesn't see it
    if (world) {
      setTimeout(() => {
        world && world.stop();
        setWorld(null);
      }, 300);
    }
  };
  
  useEffect(() => console.log('world: ', world), [world]);
  // starts the world
  const startWorld = () => {
    //makes sure there isn't a current world running, then starts the next one
    if (!world) {
      setWorld(
        World(matterDiv.current, [
          {
            point: 22,
            label: "about",
            visibility: true,
            color: "orange",
            size: "32",
            family: "Arial",
            onClickFunction: () => handleButtonPress("about"),
          },
          {
            point: 33,
            label: "projects",
            visibility: true,
            color: "orange",
            size: "32",
            family: "Arial",
            onClickFunction: () => handleButtonPress("projects"),
          },
          {
            point: 55,
            label: "resume",
            visibility: true,
            color: "orange",
            size: "32",
            family: "Arial",
            onClickFunction: () => handleButtonPress("resume"),
          },
          {
            point: 123,
            label: "about\nabout\nABOUT",
            visibility: true,
            color: "orange",
            size: "32",
            family: "Arial",
            onClickFunction: () => handleButtonPress("about"),
          },
          {
            point: 134,
            label: "about",
            visibility: true,
            color: "orange",
            size: "32",
            family: "Arial",
            onClickFunction: () => handleButtonPress("about"),
          },
        ])
      );
    }
  };

  return (
    <div
      id="LandingPage"
      ref={landingPageRef}
      className={landingPageStyles.landingPageContainer}
      onClick={() => document.querySelector('.App').scrollTo(0, 800)}
    >
      <div className={landingPageStyles.matterContainer} onClick={(e) => e.stopPropagation()} ref = {matterDiv}></div>
      <div
        ref={popUpReference}
        className={landingPageStyles.hidden}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className={landingPageStyles.modal_container}>
          <div
            className={landingPageStyles.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            {currentlyDisplayed}
          </div>
        </div>
      </div>
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
