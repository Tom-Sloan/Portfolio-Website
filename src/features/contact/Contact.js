import styles from "./Contact.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { Card } from "../../components/Cards/Card";
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
          link: "https://www.linkedin.com/in/danielneasmith/",
          text: "Daniel Neasmith",
        },
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
          link: "https://github.com/DanNeasmith",
          text: "Daniel Neasmith",
        },
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
          link: "mailto:danneasmith@gmail.com",
          text: "Daniel Neasmith",
        },
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
      max: 35,
    };
    const element = document.querySelectorAll(".cardContent");
    VanillaTilt.init(element, options);

    // element.addEventListener("tiltChange", callback);
  }, []);
  return (
    <div className={styles.contactParent} >
      <Card elements={contactInformation} />
      {/* <h2 style={{ textAlign: 'center' }} >Get in Touch</h2>
            <hr /> */}
    </div>
  );
}
