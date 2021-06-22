import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import World from "./World";
import landingPageStyles from "./LandingPage.module.css";
import { BubbleTiles } from "../BubbleTiles/BubbleTiles";
import { TestData } from "../../features/About/AboutTestOption";
import { Resume } from "../../features/resume/Resume";
import { Projects } from "../../features/projects/Projects";
import styles from "../headerStyles.module.css";

export function LandingPage() {
  const landingPageRef = useRef(null);
  const [world, setWorld] = useState();
  const [startGame, setStartGame] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const history = useHistory();
  const [currentlyDisplayed, setCurrentDisplayed] = useState(null);
  const popUpReference = useRef(null);

  useEffect(() => {
    if (document.cookie.includes("landingPage")) {
      // document
      //   .querySelector(".App")
      //   .scrollTo(0, landingPageRef.current.clientHeight);
    } else {
      console.log("not here");
      document.cookie =
        "landingPage=visited; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    }

    //Add world
    startWorld();

    document.querySelector(".App").addEventListener("scroll", handleRestart);

    return window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleButtonPress = (destination = "home") => {
    history.push(destination);
    console.log(destination === "projects");
   
    if (destination === "about") {
      setCurrentDisplayed(<BubbleTiles visualData={bubbleTilesInitial} />);
    } else if (destination === "projects") {
      console.log("here");
      setCurrentDisplayed(
        <div className={styles.parallaxParent}>
          <div className={styles.parallax}></div>
          <Projects />
        </div>
      );
      console.log(currentlyDisplayed);
    } else if (destination === "resume") {
      console.log("here");
      setCurrentDisplayed(
        <div className={styles.parent}>
          <Resume />
        </div>
      );
      console.log("here");
    }else{
      setCurrentDisplayed(<BubbleTiles visualData={bubbleTilesInitial} />);
    }

    popUpReference.current.classList.toggle(landingPageStyles.modal);
  };
  const handleScroll = (e) => {
    stopWorld();
  };
  const stopWorld = () => {
    document
      .querySelector(".App")
      .scrollTo(0, landingPageRef.current.clientHeight);
    if (isRunning) {
      setTimeout(() => world.stop(), 1000);
      setIsRunning(false);
    }
  };
  const startWorld = () => {
    setWorld(
      World(landingPageRef.current, [
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
    setIsRunning(true);
  };
  const handleRestart = ({ target }) => {
    if (!target.scrollTop) {
      startWorld();
    }
  };
  const handleClick = (e) => {
    e.stopPropagation();
  };
  const closePopUp = (e) => {
    popUpReference.current.classList.remove(landingPageStyles.modal);
  };
  return (
    <div
      id="LandingPage"
      ref={landingPageRef}
      style={{ height: "100vh" }}
      className={landingPageStyles.landingPageContainer}
      onClick={closePopUp}
      onWheel={handleScroll}
    >
      <div ref={popUpReference} className={landingPageStyles.hidden} onWheel={handleClick}>
        <div
          className={landingPageStyles.modal_container}
          onClick={handleClick}
        >
          <div className={landingPageStyles.modal_content}>
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
