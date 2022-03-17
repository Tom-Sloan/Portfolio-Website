import styles from "./Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

export function Contact() {
  const contactInformation = [
    {
      removeNumbers: true,
      title: "LinkedIn",
      icon: <FontAwesomeIcon className={styles.icons} icon={faLinkedin} />,
      link: [
        {
          link: "https://www.linkedin.com/in/tomsloan7/",
          text: "Tom Sloan",
        },
      ],
    },
    {
      removeNumbers: true,
      title: "Github",
      icon: <FontAwesomeIcon className={styles.icons} icon={faGithubSquare} />,
      link: [
        {
          link: "https://github.com/Tom-Sloan",
          text: "Tom Sloan",
        },
      ],
    },
    {
      removeNumbers: true,
      title: "Email",
      icon: <FontAwesomeIcon className={styles.icons} icon={faPaperPlane} />,
      link: [
        {
          link: "mailto:tsloan81@gmail.com",
          text: "Tom Sloan",
        },
      ],
    },
  ];
  useEffect(() => {
    const options = {
      reverse: true,
      glare: true,
      "max-glare": 0.5,
      max: 10,
    };
    const element = document.querySelectorAll(".cardContent");
    VanillaTilt.init(element, options);

    // element.addEventListener("tiltChange", callback);
  }, []);
  return (
    <Card elements={contactInformation} onClick={(e) => e.stopPropagation()} />
  );
}

function Card({
  elements,
  limit = -1,
  addLinkAtEnd = false,
  endRedirectLink = "#",
  title,
}) {
  if (limit === -1) {
    limit = elements.length;
    if (addLinkAtEnd) {
      elements = Object.assign([], elements);
      elements.push({});
    }
  }

  return (
    <div className={styles.container}>
      {elements.map((elm, index) => {
        if (index < limit) {
          return (
            <div key={"card-" + index} className={`${styles.card} cardContent`}>
              {(elm.hasOwnProperty("removeNumbers") && !elm.removeNumbers) ||
              !elm.hasOwnProperty("removeNumbers") ? (
                <h2>{"0" + (index + 1)}</h2>
              ) : null}

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

                <h3>{elm.title}</h3>
                <p>{elm.subtitle}</p>
                <div>
                  {elm.category &&
                    elm.category.map((item, tagIndex) => {
                      return (
                        <span
                          key={"card-tag-" + tagIndex}
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
                    elm.link.map((link, linkIndex) => (
                      <a key={"card-link-" + linkIndex} href={link.link}>
                        {link.text || "Read More"}
                      </a>
                    ))) || <a href={elm.link}>Read More</a>)}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
