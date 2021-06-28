import React from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";

import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { HeaderBar } from "./components/HeaderBar/headerBar";
import { Body } from "./components/body";
import { LandingPage } from "./components/LandingPage/LandingPage";

function App() {
  return (
    <Router>
      <BreakpointProvider>
        <div className="App  light-theme ">
          {/* <Breakpoint medium up>
            <LandingPage id="LandingPage" />
          </Breakpoint> */}
          <HeaderBar />
          <Body />
        </div>
      </BreakpointProvider>
    </Router>
  );
}

export default App;
