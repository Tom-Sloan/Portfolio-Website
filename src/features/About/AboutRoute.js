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
