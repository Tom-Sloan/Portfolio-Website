import styles from "./Home.module.scss";
import { selectProjectsArray } from "../projects/projectsSlice";
import { useSelector } from "react-redux";
import { Card } from "../../components/Cards/Card";
import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";
import "./Home.scss";
import { useState, useContext } from "react";
import {selectPersonInformation} from './homeSlice'
import { NameContext } from "../../AllContexts";



export function Home() {
  const personName = useContext(NameContext).personName;
  const projects = useSelector(selectProjectsArray)[personName];
  const person = useSelector(selectPersonInformation)[personName]
  const quotes = person['quotes'];
  const experiences = person.experiences;
  const [quoteNumber, setQuoteNumber] = useState(0);

  useEffect(() => {
    const options = {
      reverse: true,
      glare: true,
      "max-glare": 0.5,
      max: 35,
    };
    const element = document.querySelectorAll(".cardContent");
    VanillaTilt.init(element, options);
    const intervalId = setInterval(() => {
      setQuoteNumber((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`${styles.home} backgroundImage`}>
      <div className={`${styles.top} topLevelHome`}>
        <div className={styles.profile}>
          <div className={styles.profileImageContainer}>
            <img src="./profilePictures/tomsProfilePhoto.png" alt="Profile" />
            <img
              src="./profilePictures/dan.jpg"
              alt="Profile"
            />
          </div>
          <div className={`${styles.name}`}>
            <h1>Dan and Tom</h1>
          </div>
        </div>
      </div>
      <div className={styles.divider}>
        <h1>Challenge? That's just an appetizer.</h1>
      </div>
      <div className={styles.skillsContainer}>
        <div className={styles.skills}>
          <h2>Experience With:</h2>
          <div className={styles.skillsLayout}>
            {experiences.map((elm) => (
              <section className={styles.circleContainer}>
                <div className={styles.circle}>
                  <img
                    className={`${styles.experienceImage} ${elm.addedClasses||''}`}
                    src={elm.imageUrl}
                    alt={elm.title}
                  />
                </div>
                <p>{elm.title}</p>
              </section>
            ))}
          </div>
        </div>
      </div>

      <div
        className={styles.divider}
        onClick={() => setQuoteNumber((prev) => prev + 1)}
      >
        {quotes.map((elm, index) => {
          if (quoteNumber % quotes.length === index) {
            return (
              <div className={styles.quoteContainer}>
                <h2 className={styles.quote}>{elm.quote}</h2>
                <h3 className={styles.quoteAuthor}>{elm.quoteAuthor}</h3>
              </div>
            );
          }
          return null;
        })}
      </div>
      <Card
        elements={projects}
        title={"~Portfolilo Highlights~"}
        addLinkAtEnd={true}
        endRedirectLink="/projects"
      />
      {/* <PageScrollBar parentPercentPosition={parentPercentPosition} /> */}
    </div>
  );
}



/*
// import { PageScrollBar } from "./PageScrollBar/PageScrollBar";
// import { Icon, InlineIcon } from "@iconify/react";
// import reduxIcon from "@iconify-icons/cib/redux";
// import reactIcon from "@iconify-icons/cib/react";
// import netlifyIcon from "@iconify-icons/cib/netlify";
            <div className={styles.imageContainer}>
              <img
                className={styles.experienceImage}
                src="./microcontroller.png"
                alt="pcb icon by Eucalyp"
              />
              <h4>Microcontroller Programing</h4>
            </div>
            <div className={styles.imageContainer}>
              <img
                className={`${styles.experienceImage} invert`}
                src="./circuit.png"
                alt="pcb icon by Good Ware"
              />
              <h4>Circuit fabrication and design</h4>
            </div>

            <div className={styles.iconContainer}>
              <Icon className={styles.experienceIcon} icon={reactIcon} />
              <h4>React</h4>
            </div>
            <div className={styles.iconContainer}>
              <Icon className={styles.experienceIcon} icon={reduxIcon} />
              <h4>Redux</h4>
            </div>
            <div className={styles.iconContainer}>
              <Icon className={styles.experienceIcon} icon={netlifyIcon} />
              <h4>Netlify</h4>
            </div>
          </div>
        
*/
