import React from 'react';
import styles from './headerStyles.module.css';
import {
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Home } from '../features/home/Home';
import { Footer } from './footerBar'

export function Body() {
    return (
        <div className={styles.bodyArea} >
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/projects">
                    <Projects />
                </Route>
                <Route path="/resume">
                    <Resume />
                </Route>
                <Route path="/contact">
                    <Contact />
                </Route>
            </Switch>
            <Footer />
        </div>
    )
}

function About() {
    return (
        <div>
            <h2>About</h2>
        </div>
    );
}

function Projects() {
    return (
        <div>
            <h2>Projects</h2>
        </div>
    );
}

function Resume() {
    return (
        <div>
            <h2>Resume</h2>
        </div>
    );
}

function Contact() {
    return (
        <div>
            <h2>Contact</h2>
        </div>
    );
}