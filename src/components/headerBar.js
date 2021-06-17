import React, { useState } from "react";
import styles from "./headerStyles.module.css";
import { Switch, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faMugHot } from "@fortawesome/free-solid-svg-icons";

export function HeaderBar() {
  const [mugSelector, setMugSelector] = useState(0);
  const mugs = [faMugHot, faCoffee];
  const handleClick = (e) => {
    document.querySelector(".App").classList.toggle("dark-theme");
    setMugSelector((prev) => (prev ? 0 : 1));
  };

  console.log(mugSelector);
  return (
    <div className={styles.headerBar}>
      <div className={styles.headerLinks}>
        <Link className={styles.headerLink} to="/">
          Home
        </Link>
        <Link className={styles.headerLink} to="/about">
          About
        </Link>
        <Link className={styles.headerLink} to="/projects">
          Projects
        </Link>
        <Link className={styles.headerLink} to="/resume">
          Resume
        </Link>
        <Link className={styles.headerLink} to="/contact">
          Contact
        </Link>
        <div className={styles.iconContainer} onClick={handleClick}>
          <FontAwesomeIcon
            onClick={handleClick}
            className={styles.colorUIChangeIcon}
            icon={mugs[mugSelector]}
          />
        </div>
      </div>
    </div>
  );
}
