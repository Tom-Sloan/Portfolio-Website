import { useRef, useEffect, useState } from "react";
import World from "./World";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  const landingPageRef = useRef(null);
  const [world, setWorld] = useState();
  const [startGame, setStartGame] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

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
    setWorld(World(landingPageRef.current));
    setIsRunning(true)
    document.querySelector(".App").addEventListener("scroll", handleRestart);

    return window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (e) => {
    
    document
      .querySelector(".App")
      .scrollTo(0, landingPageRef.current.clientHeight);
    if(isRunning){
      setTimeout(() => world.stop(), 3000);
      setIsRunning(false)
    }
  };
  const handleRestart = ({ target }) => {
    if (!target.scrollTop) {
      setWorld(World(landingPageRef.current));
      setIsRunning(true)
    }
  };
  const handleClick = () => {
    world.runGame(startGame);
    setStartGame(prev=>!prev);
  };
  return (
    <div
      id="LandingPage"
      ref={landingPageRef}
      style={{ height: "100vh" }}
      onWheel={handleScroll}
      className={styles.landingPageContainer}
      onClick={handleClick}
    >
      {/* <World /> */}
    </div>
  );
}
