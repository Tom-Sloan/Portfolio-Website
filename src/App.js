import React, { useState, useContext } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";

import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { HeaderBar } from "./components/HeaderBar/headerBar";
import { Body } from "./components/body";
import { LandingPage } from "./components/LandingPage/LandingPage";
import {NameContext} from './AllContexts'

function App() {
  const [personName, setPersonName] = useState('tom')
  return (
    <Router>
      <BreakpointProvider>
        <NameContext.Provider value = {{personName, setPersonName}}>
          <div
            className={`App  light-theme`}
          >
            {/* <Breakpoint medium up>
            <LandingPage id="LandingPage" />
          </Breakpoint> */}
            <HeaderBar />
            <Body />
          </div>
        </NameContext.Provider>
      </BreakpointProvider>
    </Router>
  );
}

export default App;
