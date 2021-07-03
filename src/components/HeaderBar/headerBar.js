import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./HeaderStyles.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faShapes } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { HeaderButtons } from "./headerButtons";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { NameContext } from "../../AllContexts";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { pixelToNum } from "../../helpFunctions";
import {CircleMenu} from './circleMenu'

export function HeaderBar() {
  //Mugselector is the icon state with the sun and the moon
  const [mugSelector, setMugSelector] = useState(0);

  //selected is an array that contains whether or not a button at the top is clicked. It is filled initall
  const [selected, setSelected] = useState([]);

  // //the state for whether or not the circle will pop up
  // const [popUpCircle, setPopUpCircle] = useState(false);

  //Used to toggle between dan and i
  const { _, setPersonName } = useContext(NameContext);

  //Circle Button reference
  const circleRef = useRef(null);

  //The icons that are used for light dark toggle
  const mugs = [faMoon, faSun];

  useEffect(() => {
    //set home as selected
    handleSelection(_, 0);
    //check if the user has been here before and wanted dark theme
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      //set the screen as darkScreen
      toggleDarkMode(_);

      //Make sure the user does not prefer the light theme
    } else if (currentTheme !== "light") {
      //check to see if the user prefers the light theme (in app.js I add the dark theme if the user's preferences say they like it)
      if (window.matchMedia("(prefers-color-scheme: dark)") ? "dark-theme" : "")
        toggleDarkMode(_);
    }
  }, []);

  // useEffect(() => {
  //   const circle = document.querySelector(`.${styles.outerCircle}`);
  //   if (circle) {
  //     circle.style.display = popUpCircle ? "block" : "none";
  //   }
  // }, [popUpCircle]);

  const handleSelection = (e, index) => {
    const temp = Array(headerLinks.length).fill(false);
    temp[index] = true;
    setSelected(temp);
  };

  const menuSmall = Menu(headerLinks, selected, handleSelection);
  const menuLarge = Menu(
    headerLinks,
    selected,
    handleSelection,
    styles.headerLink
  );

  const toggleDarkMode = (e) => {
    const app = document.querySelector(".App").classList;
    app.toggle("dark-theme");
    setMugSelector((prev) => (prev ? 0 : 1));
    let theme = "light";
    if (app.contains("dark-theme")) {
      theme = "dark";
    }
    localStorage.setItem("theme", theme);
  };
  let [personToggle, setPersonToggle] = useState(false);

  const onPersonChange = (checked) => {
    setPersonToggle(checked);
    setPersonName(checked ? "dan" : "tom");
  };

  return (
    <div className={styles.headerBar}>
      <div className={styles.headerLinks}>
        {menuLarge}
        <div className={styles.headerScrollBar}>
          <ScrollMenu
            data={menuSmall}
            arrowLeft={<div></div>}
            arrowRight={<div></div>}
            selected={selected}
            setSelected={setSelected}
            
          />
        </div>
      </div>
      <div className={styles.optionsContainer}>
        <div
          className={`${styles.iconContainer} ${styles.extraContainer}`}
          onClick={toggleDarkMode}
        >
          <FontAwesomeIcon
            className={styles.colorUIChangeIcon}
            icon={mugs[mugSelector]}
          />
        </div>
        <div className={`${styles.headerLink} `}>
          <ToggleSwitch
            id="personToggle"
            checked={personToggle}
            onChange={onPersonChange}
            optionLabels={["Dan", "Tom"]}
            cvPage={true}
          />
        </div>
        {/* <div
          ref={circleRef}
          className={`${styles.iconContainer} ${styles.popUpCircleContainer} ${styles.extraContainer}`}
          onClick={() => setPopUpCircle((prev) => !prev)}
        >
          <FontAwesomeIcon
            className={styles.colorUIChangeIcon}
            icon={faShapes}
          />
          {CircleMenu(headerLinks, selected, handleSelection)}
        </div> */}
      </div>
    </div>
  );
}

export const Menu = (
  list,
  selected,
  handleSelection,
  extraClasses = "",
  style
) =>
  list.map((el, index) => {
    return (
      <Link
        to={el.destination}
        key={el.title + "-link-" + index}
        className={extraClasses}
        style={style}
      >
        <HeaderButtons
          name={el.title + "-" + index}
          text={el.title}
          key={el.title + "-" + index}
          selected={selected[index]}
          handleSelection={handleSelection}
          index={index}
        />
      </Link>
    );
  });


const headerLinks = [
  {
    destination: "/",
    title: "Home",
  },
  {
    destination: "/about",
    title: "About",
  },
  {
    destination: "/projects",
    title: "Projects",
  },
  {
    destination: "/resume",
    title: "Resume",
  },
  {
    destination: "/contact",
    title: "Contact",
  },
];
