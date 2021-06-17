import React from "react";
import styles from "./headerStyles.module.css";
import { Switch, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons'

export function HeaderBar() {

  const handleClick = (e) => {
    document.querySelector('.App').classList.toggle('dark-theme');
  };


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
        <div className={styles.iconContainer} onClick={handleClick} >
          <FontAwesomeIcon className={styles.colorUIChangeIcon} icon={faCoffee} />
        </div>
      </div>
    </div >
  );
}
