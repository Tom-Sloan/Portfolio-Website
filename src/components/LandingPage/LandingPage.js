import { useRef, useEffect, useState } from "react";
import World from "./World";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  const landingPageRef = useRef(null);
  const [world, setWorld] = useState();
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    if (document.cookie.includes("landingPage")) {
      console.log("here");
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

    document
      .querySelector(".App")
      .addEventListener("scroll", handleRestart);

    return window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleScroll = (e) => {
    console.log("wheel");
    document
      .querySelector(".App")
      .scrollTo(0, landingPageRef.current.clientHeight);
    setTimeout(()=>world.stop(), 3000);
  };
  const handleRestart = ({target}) => {
    if(!target.scrollTop){
      setWorld(World(landingPageRef.current));
    }
  };
  const handleClick = () => {
    if(!startGame){
      setStartGame(true);
      world.runGame()
    }
  }
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
