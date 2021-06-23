import React, { useState } from "react";
import styles from "./HeaderStyles.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faMugHot,
  faAngleDoubleUp,
} from "@fortawesome/free-solid-svg-icons";
import { HeaderButtons } from "./headerButtons";
import ScrollMenu from "react-horizontal-scrolling-menu";
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

export function HeaderBar() {
  const [mugSelector, setMugSelector] = useState(0);
  const [selected, setSelected] = useState(headerLinks[0]);
  const mugs = [faMugHot, faCoffee];
  const menu = Menu(headerLinks, selected);
  const handleClick = (e) => {
    document.querySelector(".App").classList.toggle("dark-theme");
    setMugSelector((prev) => (prev ? 0 : 1));
  };

  return (
    <div className={styles.headerBar}>
      <div className={styles.headerLinks}>
        <div
          className={styles.iconContainer}
          onClick={(e) => document.querySelector(".App").scrollTo(0, 0)}
        >
          <FontAwesomeIcon
            className={styles.colorUIChangeIcon}
            icon={faAngleDoubleUp}
          />
        </div>

        {headerLinks.map((elm) => (
          <Link className={styles.headerLink} to={elm.destination}>
            {elm.title}
          </Link>
        ))}
        <div className={styles.headerScrollBar}>
          <ScrollMenu
            data={menu}
            arrowLeft={<div></div>}
            arrowRight={<div></div>}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
        <div className={styles.iconContainer} onClick={handleClick}>
          <FontAwesomeIcon
            className={styles.colorUIChangeIcon}
            icon={mugs[mugSelector]}
          />
        </div>
      </div>
    </div>
  );
}
export const Menu = (list, selected) =>
  list.map((el) => {
    return (
      <Link  to={el.destination}>
        <HeaderButtons
          name={el.title}
          text={el.title}
          key={el}
          selected={selected}
        />
      </Link>
    );
  });
