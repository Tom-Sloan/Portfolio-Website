import styles from "./Home.module.css";
import { selectProjectsArray } from "../projects/projectsSlice";
import { useSelector } from "react-redux";
import { Card } from "../../components/Cards/Card";


export function Home() {
  const projects = useSelector(selectProjectsArray);
  console.log(projects);

  return (
    <div className={styles.home}>
      <div className={styles.top}>
        <div className={styles.profile}>
          <img
            src="https://i2.wp.com/news.microsoft.com/europe/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1"
            alt="Profile"
          />
        </div>
        <div className={styles.name}>
          <h1>Dan and Tom</h1>
        </div>
      </div>
      <div className={styles.divider}>
        <h1>
          Challenge? That's just an appetizer.
        </h1>
      </div>
      <Card elements={projects} endRedirectLink="/projects" />
    </div>
  );
}
