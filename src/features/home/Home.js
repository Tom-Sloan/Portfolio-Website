import styles from "./Home.module.css";
import { selectProjectsArray } from "../projects/projectsSlice";
import { useSelector } from "react-redux";
import { Card } from "../../components/Cards/Card";
import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

export function Home() {
  const projects = useSelector(selectProjectsArray);
  console.log(projects);
  useEffect(() => {
    const options = {
      reverse:true,
      glare: true,
      'max-glare':0.5,
      max: 35,
    }
    const element = document.querySelectorAll(".cardContent");
    VanillaTilt.init(element, options);
    
    // element.addEventListener("tiltChange", callback);
  }, []);
  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <div className={styles.profile}>
          <img
            src="https://i2.wp.com/news.microsoft.com/europe/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1"
            alt="Profile"
          />
        </div>
        <div className={`${styles.name} js-tilt`}>
          <h1>Dan and Tom</h1>
        </div>
      </div>
      <div className={styles.divider}>
        <h1>Challenge? That's just an appetizer.</h1>
      </div>
      <Card elements={projects} endRedirectLink="/projects" />
    </div>
  );
}
