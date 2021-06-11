import React from 'react';
import styles from './headerStyles.module.css';
import {
    Switch,
    Route,
    Link
} from "react-router-dom";

export function Footer () {
    return (
        <div className={styles.footer} >
            <div className={styles.headerLinks}>
                <Link className={styles.headerLink} to="/">Home</Link>
                <Link className={styles.headerLink} to="/about">About</Link>
                <Link className={styles.headerLink} to="/projects">Projects</Link>
                <Link className={styles.headerLink} to="/resume">Resume</Link>
                <Link className={styles.headerLink} to="/contact">Contact</Link>
            </div>
        </div>
    )
}