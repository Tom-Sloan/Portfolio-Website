import React from "react";
import styles from "./FooterStyles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <div className={styles.footer}>
      <div>
        <Link className={styles.headerLink} to="/contact">
          <FontAwesomeIcon className={styles.footerIcons} icon={faLinkedin} />
        </Link>
        <Link className={styles.headerLink} to="/contact">
          <FontAwesomeIcon
            className={styles.footerIcons}
            icon={faGithubSquare}
          />
        </Link>
      </div>
      <p>2021 by Tom Sloan and Daniel Neasmith</p>
      {/* <div className={styles.headerLinks}>
                <Link className={styles.headerLink} to="/">Home</Link>
                <Link className={styles.headerLink} to="/about">About</Link>
                <Link className={styles.headerLink} to="/projects">Projects</Link>
                <Link className={styles.headerLink} to="/resume">Resume</Link>
                <Link className={styles.headerLink} to="/contact">Contact</Link>
            </div> */}
    </div>
  );
}
