import styles from "./Home.module.scss";
import { selectProjectsArray } from "../projects/projectsSlice";
import { useSelector } from "react-redux";
import { Card } from "../../components/Cards/Card";
import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";
import "./Home.scss";
import { useState } from "react";
import { PageScrollBar } from "./PageScrollBar/PageScrollBar";
import { Icon, InlineIcon } from "@iconify/react";
import reduxIcon from "@iconify-icons/cib/redux";
import reactIcon from "@iconify-icons/cib/react";
import netlifyIcon from "@iconify-icons/cib/netlify";

export function Home({ parentPercentPosition }) {
  const projects = useSelector(selectProjectsArray);
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
          <div className={styles.profileImageContainers}>
            <img
              src="https://i2.wp.com/news.microsoft.com/europe/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1"
              alt="Profile"
            />
            <img
              src="https://i2.wp.com/news.microsoft.com/europe/wp-content/themes/microsoft-news-center-2016/assets/img/default-avatar.png?ssl=1"
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
      
      <Card
        elements={projects}
        title={"~Portfolilo Highlights~"}
        addLinkAtEnd={true}
        endRedirectLink="/projects"
      />
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

      <div className={styles.skillsContainer}>
        <div className={styles.skills}>
          <h2>Experience With:</h2>
          <div className={styles.skillsLayout}>
            {/* <img src='./pcb.png' alt='pcb icon by surang'/> */}
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
        </div>
      </div>
      <PageScrollBar parentPercentPosition={parentPercentPosition} />
    </div>
  );
}

const quotes = [
  {
    quote:
      "A journey will have pain and failure. It is not only the steps forward that we must accept. It is the stumbles... But if we stop, if we accept the person we are when we fall, the journey ends. That failure becomes our destination.",
    quoteAuthor: "Brandon Sanderson",
  },
  {
    quote: "Would you have a great empire? Rule over yourself",
    quoteAuthor: "Pubilius Syrus",
  },
  {
    quote:
      "I do not fear death. I had been dead for billions and billions of years before I was born, and had not suffered the slightest inconvenience from it.",
    quoteAuthor: "Mark Twain",
  },
  {
    quote: "We are dying every day.",
    quoteAuthor: "Seneca the Younger",
  },
  {
    quote: "Waste no more time arguing what a good man should be. Be One.",
    quoteAuthor: "Marcus Aurelius",
  },
  {
    quote:
      "It never ceases to amaze me: we all love ourselves more than other people, but care more about their opinion than our own.",
    quoteAuthor: "Marcus Aurelius",
  },
];
