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

export function HeaderBar() {
  //Mugselector is the icon state with the sun and the moon
  const [mugSelector, setMugSelector] = useState(0);

  //selected is an array that contains whether or not a button at the top is clicked. It is filled initall
  const [selected, setSelected] = useState([]);

  //the state for whether or not the circle will pop up
  const [popUpCircle, setPopUpCircle] = useState(false);

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

    //Add circles
    // if (!document.querySelector(`.${styles.innerCircle}`)) {
    //   Position.ellipse(
    //     10,
    //     150,
    //     150,
    //     4,
    //     42,
    //     styles.circle,
    //     styles.innerCircle,
    //     true
    //   );
    //   console.log(circleRef.current);
    // }
  }, []);

  useEffect(() => {
    const circle = document.querySelector(`.${styles.outerCircle}`);
    if (circle) {
      circle.style.display = popUpCircle ? "block" : "none";
    }
  }, [popUpCircle]);

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
  const menuCircle = Menu(
    headerLinks,
    selected,
    handleSelection,
    styles.innerCircle
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
        <div
          ref={circleRef}
          className={`${styles.iconContainer} ${styles.popUpCircleContainer}`}
          onClick={() => setPopUpCircle((prev) => !prev)}
        >
          <FontAwesomeIcon
            className={styles.colorUIChangeIcon}
            icon={faShapes}
          />
          {CircleMenu(headerLinks, selected, handleSelection)}
        </div>
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

export const CircleMenu = (list, selected, handleSelection) => {
  const circleRef = useRef(null);
  const getTopLeftLocation = (rx, ry, i, total, offset, clockwise) => {
    const scaleX = 1;
    const top =
      String(
        ry + -ry * Math.cos((360 / total / 180) * (i + offset) * Math.PI)
      ) + "px";
    const left =
      String(
        rx +
          (rx / scaleX) *
            (clockwise
              ? Math.sin((360 / total / 180) * (i + offset) * Math.PI)
              : -Math.sin((360 / total / 180) * (i + offset) * Math.PI))
      ) + "px";

    return {
      top: top,
      left: left,
      transform: `rotate(${
        (360 / total / 180) * (i + offset) * Math.PI + Math.PI / 2
      }rad)`,
    };
  };

  const circleData = {
    n: 14,
    rx: 150,
    ry: 150,
    so: 4,
    cw: true,
    wh: 100,
  };
  const circleTemp = Array(circleData.n).fill(0);
  const outerCircleStyle = {
    width: String(circleData.rx * 2 + circleData.wh) + "px",
    height: String(circleData.ry * 2 + circleData.wh) + "px",
  };
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastTouchMove, setLastTouchMove] = useState(null);
  const handleTouchMove = (e) => {
    if (lastTouchMove === null) {
      setLastTouchMove(e.touches);
      return;
    }
    console.log(lastTouchMove[0]);
    const currentTouch = e.touches;
    // console.log(currentTouch[0].pageY);
    // return
    // var rotation = e.rotation;

    // // This isn't a fun browser!
    // if ( ! rotation) {
    //      rotation = Math.arctan2(e.touches[0].pageY - e.touches[1].pageY,
    //            e.touches[0].pageX - e.touches[1].pageX) * 180 / Math.PI;
    // }

    // Take into account vendor prefixes, which I haven't done.
    const circleCoords = circleRef.current.getBoundingClientRect();
    const center = {
      x: circleCoords.top ,
      y: circleCoords.left ,
    };
    
    console.log("center: ", center.x, center.y);
    setToPosition(ref1, center.x, center.y);
    setToPosition(ref2, lastTouchMove[0].pageX, lastTouchMove[0].pageY);
    setToPosition(ref3, currentTouch[0].pageX, currentTouch[0].pageY);
    const centerToLast = distance(
      center.x,
      center.y,
      lastTouchMove[0].pageX,
      lastTouchMove[0].pageY
    );
    const centerToCurrent = distance(
      center.x,
      center.y,
      currentTouch[0].pageX,
      currentTouch[0].pageY
    );
    const lastToCurrent = distance(
      lastTouchMove[0].pageX,
      lastTouchMove[0].pageY,
      currentTouch[0].pageX,
      currentTouch[0].pageY
    );

    const theta =
      (Math.pow(centerToCurrent, 2) +
        Math.pow(centerToLast, 2) -
        Math.pow(lastToCurrent, 2)) /
      (2 * centerToCurrent * centerToLast);
    console.log(theta);
    // const rotation = Math.acos()
    // const rotation = Math.atan2(lastTouchMove[0].pageY - currentTouch[0].pageY,
    //   lastTouchMove[0].pageX - currentTouch[0].pageX) * 180 / Math.PI;
    circleRef.current.style.transform = "rotate(" + 10 + "deg)";
    // console.log(rotation)
    setLastTouchMove(currentTouch);
    // setCurrentPosition(rotation)
  };
  const setToPosition = (reference, x, y) => {
    console.log(reference.current, x, y);
    reference.current.style.top = x + "px";
    reference.current.style.left = y + "px";
  };
  const distance = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  return (
    <div
      ref={circleRef}
      className={styles.outerCircle}
      onTouchMove={handleTouchMove}
      style={outerCircleStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={ref1}
        className={styles.pointMarker}
        style={{ background: "blue" }}
      ></div>
      <div
        ref={ref2}
        className={styles.pointMarker}
        style={{ background: "tomato" }}
      ></div>
      <div
        ref={ref3}
        className={styles.pointMarker}
        style={{ background: "green" }}
      ></div>

      {circleTemp.map((_, index) => {
        const el = list[index % list.length];
        const style = getTopLeftLocation(
          circleData.rx,
          circleData.ry,
          index,
          circleData.n,
          circleData.so,
          circleData.cw
        );

        return (
          <Link
            to={el.destination}
            key={el.title + "-link-" + index}
            className={styles.innerCircle}
            style={style}
          >
            <HeaderButtons
              name={el.title + "-" + index}
              text={el.title}
              key={el.title + "-" + index}
              selected={selected[index]}
              handleSelection={handleSelection}
              index={index}
              minified={true}
            />
          </Link>
        );
      })}
    </div>
  );
};

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
