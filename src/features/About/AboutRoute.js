/*
The overal structure of the about section has 4 main parts:
1. About route: this used to differeniate btwn the subsections avaliable. 
  This is what is used to make the svgs clickable and to change z-index.
  this can moved to the parent componenet but it is here for clarity.

2. About: this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes

3. Paddle: this are the svgs and content containers. Each option had its own paddle
  component. inside of here is the styling and setup to make the paddles have shaped 
  svgs and to be clickable to the link in 1. 

4. (*Option): these files are the setup elements that are inside each paddle and contain the 
  relevant information to each option.
*/

import React, { useState, useEffect } from "react";
import styles from "./About.module.css";
import {About} from './About'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

export function AboutRoute() {
  return (
    <Switch>
      <Route exact path="/about" component={About} />
      <Route path="/about/:number" component={About} />
    </Switch>
  );
}
