import styles from "./Information.module.css";
import projects from "./data";
import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export function Projects() {
  useEffect(() => {
    const options = {
      reverse: true,
      // glare: true,
      // 'max-glare': 0.5,
      max: 3,
    };
    const element = document.querySelectorAll(`.${styles.tiltCard}`);
    VanillaTilt.init(element, options);

    // element.addEventListener("tiltChange", callback);
  }, []);
  return (
    <div className={styles.projectList}>
      {/*onChange={updateWindowDimensions}*/}
      {projects.length > 0 &&
        projects.map((data, idx) => (
          <div
            className={styles.tiltCard}
            onClick={(e) => e.stopPropagation()}
            key={"tilt-card-" + idx}
          >
            <div className={styles.project} id={`data ${idx}`}>
              {data.category.map((item, indx) => {
                return (
                  <span
                    className={styles.tags}
                    style={{ background: item.color }}
                    key={"tiltCardSpan - " + indx}
                  >
                    {item.tag}
                  </span>
                );
              })}
              <h2>
                {data.title}
                {data.link && (
                  <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkData}
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                )}
              </h2>

              <hr style={{ borderColor: "#2aa6cf" }} />

              <h3>{data.subtitle}</h3>
              {data.image && (
                <img
                  src={data.image}
                  alt=""
                  // onLoad={updateWindowDimensions}
                />
              )}
              <time>
                {data.monthstart} {data.yearstart} - {data.monthend}{" "}
                {data.yearend}
              </time>
              <p>{data.description}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
