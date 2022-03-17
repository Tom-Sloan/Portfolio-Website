import styles from "../../components/BodyStyles.module.css";
import { Projects } from "./Projects";
import { useRef, useEffect, useState, useContext } from "react";
import Background from "./background";
import { Footer } from '../../components/FooterBar/footerBar'
import { IsDarkThemeContext } from "../../AllContexts";

export function ProjectsContainer() {
  const projectsBackgroundRef = useRef(null);
  const world = useRef()
  const {isDarkTheme}  = useContext(IsDarkThemeContext);

  useEffect(() => {
    // world.current = Background(projectsBackgroundRef.current);

    return function cleanup() {
      world.current.stop();
    };
  }, []);

  useEffect(()=>{
    console.log('switching')
    world.current.changeToDark(isDarkTheme);
  }, [isDarkTheme])

  function background() {
    world.current = new Background(projectsBackgroundRef.current, document.querySelector('.dark-theme')?true:false);
  }

  function cleanup() {
    world.current.stop();
  }

  return (
    <div className={styles.parallaxParent}>
      <div ref={projectsBackgroundRef} className={`${styles.parallax}`}></div>
      <Projects background={background} cleanup={cleanup} />
      <Footer />
    </div>
  );
}
