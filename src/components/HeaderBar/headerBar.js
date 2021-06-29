import React, { useContext, useEffect, useState } from "react";
import styles from "./HeaderStyles.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-regular-svg-icons";
import { HeaderButtons } from "./headerButtons";
import ScrollMenu from "react-horizontal-scrolling-menu";
import { NameContext } from "../../AllContexts";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
export function HeaderBar() {
  const [mugSelector, setMugSelector] = useState(0);
  const [selected, setSelected] = useState(
    Array(headerLinks.length).fill(false)
  );
  const { _, setPersonName } = useContext(NameContext);
  const mugs = [faMoon, faSun];

  useEffect(() => {
    setMugSelector(
      Array.from(document.querySelector(".App").classList).includes(
        "dark-theme"
      )
        ? 1
        : 0
    );
  }, []);
  const handleSelection = (e, index) => {
    const temp = Array(headerLinks.length).fill(false);
    temp[index] = true;
    setSelected(temp);
  };
  useEffect(() => console.log(mugSelector), [mugSelector]);
  const menu = Menu(headerLinks, selected, handleSelection);
  const handleClick = (e) => {
    document.querySelector(".App").classList.toggle("dark-theme");
    setMugSelector((prev) => (prev ? 0 : 1));
  };
  let [personToggle, setPersonToggle] = useState(false);

  const onPersonChange = (checked) => {
    setPersonToggle(checked);
    setPersonName(checked ? "dan" : "tom");
  };
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerLinks}>
        {/* <div
          className={styles.iconContainer}
          onClick={(e) => document.querySelector(".App").scrollTo(0, 0)}
        >
          <FontAwesomeIcon
            className={`${styles.colorUIChangeIcon} ${styles.angleDoubleUp}`}
            icon={faAngleDoubleUp}
          />
        </div> */}

        {headerLinks.map((elm) => (
          <Link
            className={styles.headerLink}
            to={elm.destination}
            key={elm.destination}
          >
            {elm.title}
          </Link>
        ))}
        <div className={styles.headerScrollBar}>
          <ScrollMenu
            data={menu}
            arrowLeft={<div></div>}
            arrowRight={<div></div>}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
        <div className={styles.iconContainer} onClick={handleClick}>
          <FontAwesomeIcon
            className={styles.colorUIChangeIcon}
            icon={mugs[mugSelector]}
          />
        </div>
        <div>
          <ToggleSwitch
            id="personToggle"
            checked={personToggle}
            onChange={onPersonChange}
            optionLabels={["Dan", "Tom"]}
            cvPage={true}
          />
          <label htmlFor="personToggle" style={{ visibility: "hidden" }}>
            Toggle 'tween resumes
          </label>
        </div>
      </div>
    </div>
  );
}

export const Menu = (list, selected, handleSelection) =>
  list.map((el, index) => {
    return (
      <Link to={el.destination} key={el.title + "-link-" + index}>
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
