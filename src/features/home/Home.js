import styles from "./Home.module.css";
import "./styles.scss";
import Tilt from "react-vanilla-tilt";
import { selectProjectsArray } from "../projects/projectsSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export function Home() {
  const style = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "1px 3px 1px #9E9E9E",
  };
  const projects = useSelector(selectProjectsArray);
  console.log(projects);
  const cards = [
    {
      title: "card one",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricesante risus, id ultricies metus sagittis quis. Nulla turpis sem.",
      link: "#",
      image:
        "https://images.unsplash.com/photo-1496077829026-34381c736acb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1931&q=80",
    },
    {
      title: "card two",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricesante risus, id ultricies metus sagittis quis. Nulla turpis sem.",
      link: "#",
      image:
        "https://images.unsplash.com/photo-1611784322338-eb4d61ae4eba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    {
      title: "card three",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricesante risus, id ultricies metus sagittis quis. Nulla turpis sem.",
      link: "#",
      image:
        "https://images.unsplash.com/photo-1496077829026-34381c736acb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1931&q=80",
    },
    {
      title: "card four",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultricesante risus, id ultricies metus sagittis quis. Nulla turpis sem.",
      link: "#",
      image:
        "https://images.unsplash.com/photo-1496077829026-34381c736acb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1931&q=80",
    },
  ];
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
          <h1>FirstName LastName</h1>
        </div>
      </div>
      <div className={styles.divider}>
        <h1>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ultrices
          ante risus, id ultricies metus sagittis quis. Nulla turpis sem.
        </h1>
      </div>

      <div className={`${styles.portfolioContainer} portfolioContainer`}>
        <div className={styles.container}>
          {projects.map((elm, index) => {
            if (index < 7) {
              return (
                <Tilt
                  className={`${styles.card} cardContent`}
                  style={style}
                  options={{
                    max: 35,
                    speed: 400,
                    glare: true,
                    "max-glare": 1,
                  }}
                >
                  <div className={`${styles.content}`}>
                    <img
                      src={elm.image}
                      alt={elm.title + " image"}
                      className="popUpImage"
                    />
                    <h2>{"0" + (index + 1)}</h2>
                    <h3>{elm.title}</h3>
                    <p>{elm.subtitle}</p>
                    {elm.category.map((item) => {
                      return (
                        <span
                          className={styles.tags}
                          style={{ background: item.color }}
                        >
                          {item.tag}
                        </span>
                      );
                    })}
                    <a href={elm.link}>Read More</a>
                  </div>
                </Tilt>
              );
            } else if (index === 7) {
              return (
                <Tilt
                  className={`${styles.endCard} cardContent`}
                  style={style}
                  options={{
                    max: 35,
                    speed: 400,
                    glare: true,
                    "max-glare": 1,
                  }}
                >
                  <Link to="/projects" className={`${styles.endContent}`}>
                    More...
                  </Link>
                </Tilt>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
