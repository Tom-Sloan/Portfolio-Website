import styles from "./Card.module.scss";
import Tilt from "react-vanilla-tilt";
import { Link } from "react-router-dom";
import "./styles.scss";

export function Card({ elements, endRedirectLink = "#" }) {
  const style = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "1px 3px 1px #9E9E9E",
  };
  return (
    <div className={`${styles.portfolioContainer} portfolioContainer`}>
      <div className={styles.container}>
        {elements.map((elm, index) => {
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
                  {(elm.image && (
                    <img
                      src={elm.image}
                      alt={elm.title + " image"}
                      className="popUpImage"
                    />
                  )) ||
                    (elm.icon && (
                      <div className={styles.iconContainer}> {elm.icon} </div>
                    ))}

                  {(elm.hasOwnProperty("removeNumbers") &&
                    !elm.removeNumbers) ||
                  !elm.hasOwnProperty("removeNumbers") ? (
                    <h2>{"0" + (index + 1)}</h2>
                  ) : null}
                  <h3>{elm.title}</h3>
                  <p>{elm.subtitle}</p>
                  <div>
                    {elm.category &&
                      elm.category.map((item) => {
                        return (
                          <span
                            className={styles.tags}
                            style={{ background: item.color }}
                          >
                            {item.tag}
                          </span>
                        );
                      })}
                  </div>
                  {elm.link &&
                    ((Array.isArray(elm.link) &&
                      elm.link.map((link) => (
                        <a href={link.link}>{link.text || "Read More"}</a>
                      ))) || <a href={elm.link}>Read More</a>)}
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
                <Link to={endRedirectLink} className={`${styles.endContent}`}>
                  More...
                </Link>
              </Tilt>
            );
          }
          return null
        })}
      </div>
    </div>
  );
}
