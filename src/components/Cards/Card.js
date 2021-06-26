import styles from "./Card.module.scss";
import { Link } from "react-router-dom";
import "./styles.scss";

export function Card({ elements, endRedirectLink = "#" }) {
  return (
    <div className={`${styles.portfolioContainer} portfolioContainer`}>
      <div className={styles.container}>
        {elements.map((elm, index) => {
          if (index < 7) {
            return (
              <div className={`${styles.card} cardContent`}>
                <div className={`${styles.content} testContent`}>
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
              </div>
            );
          } else if (index === 7) {
            return (
              <div className={`${styles.endCard} cardContent`}>
                <Link to={endRedirectLink} className={`${styles.endContent}`}>
                  More...
                </Link>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
