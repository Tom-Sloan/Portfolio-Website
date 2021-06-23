import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import World from "./World";
import landingPageStyles from "./LandingPage.module.css";
import { BubbleTiles } from "../BubbleTiles/BubbleTiles";
import { TestData } from "../../features/about/AboutTestOption";
import { ResumeContainer } from "../../features/resume/ResumeContainer";
import { ProjectsContainer } from "../../features/projects/ProjectsContainer";

export function LandingPage() {
  const landingPageRef = useRef(null);
  const [world, setWorld] = useState();
  const [isRunning, setIsRunning] = useState(false);
  const history = useHistory();
  const [currentlyDisplayed, setCurrentDisplayed] = useState(null);
  const popUpReference = useRef(null);

  useEffect(() => {
    console.log("herere and I shouldn't be");
    if (document.cookie.includes("landingPage")) {
      document
        .querySelector(".App")
        .scrollTo(0, landingPageRef.current.clientHeight);
    } else {
      document.cookie =
        "landingPage=visited; expires=Fri, 31 Dec 9999 23:59:59 GMT";
      //Add world
      startWorld();
    }

    const deboucedUpdateWindowDimensions = debounce(
      updateWindowDimensions,
      1000
    );

    window.addEventListener("resize", deboucedUpdateWindowDimensions);

    document.querySelector(".App").addEventListener("scroll", handleRestart);

    return window.removeEventListener("scroll", handleRestart);
  }, []);

  //function that gets toggled on window resize
  const updateWindowDimensions = () => {
    console.log("-----");
    console.log("Parent here:", isRunning);
    if (isRunning) {
      // stopWorld();
      console.log("here TRUE");
      document.querySelector(".App").scrollTo(0, 0);
    } else {
      console.log("here false");
      // stopWorld();
      document
        .querySelector(".App")
        .scrollTo(0, landingPageRef.current.clientHeight);
    }
  };

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

  const stopWorld = () => {
    console.log("Stoping");
    document
      .querySelector(".App")
      .scrollTo(0, landingPageRef.current.clientHeight);

    if (isRunning) {
      setIsRunning(false);
      setTimeout(() => world && world.stop(), 1000);
    }
  };
  const startWorld = () => {
    if (!isRunning) {
      setIsRunning((prev) => {
        console.log("chaning to true");
        console.log(prev);

        return true;
      });
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
    }
  };
  useEffect(() => console.log("isrunning:", isRunning), [isRunning]);
  useEffect(() => console.log("end:", world), [world]);
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
      style={{ height: "99vh" }}
      className={landingPageStyles.landingPageContainer}
      onClick={closePopUp}
      onWheel={stopWorld}
    >
      <div
        ref={popUpReference}
        className={landingPageStyles.hidden}
        onWheel={handleClick}
      >
        <div className={landingPageStyles.modal_container}>
          <div
            className={landingPageStyles.modal_content}
            onClick={handleClick}
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
