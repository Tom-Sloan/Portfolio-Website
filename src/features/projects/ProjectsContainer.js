import styles from "../../components/headerStyles.module.css";
import { Projects } from "./Projects";
import { useRef, useEffect, useState } from "react";
import Background from "./background";
import { Footer } from '../../components/footerBar'

export function ProjectsContainer() {
  const projectsBackgroundRef = useRef(null);
  const world = useRef()
  const [projectChange, setProjectChange] = useState();

  useEffect(() => {
    world.current = Background(projectsBackgroundRef.current);

    return function cleanup() {
      world.current.stop();
    };
  }, []);

  return (
    <div className={styles.parallaxParent}>
      <div ref={projectsBackgroundRef} className={`${styles.parallax}`}></div>
      <Projects />
      <Footer />
    </div>
  );
}
