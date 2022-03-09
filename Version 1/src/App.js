import React, { useState, useContext, useEffect } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";

import "./App.scss";
import { BrowserRouter as Router } from "react-router-dom";
import { HeaderBar } from "./components/HeaderBar/headerBar";
import { Body } from "./components/body";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { NameContext, IsDarkThemeContext } from "./AllContexts";

function App() {
  const [personName, setPersonName] = useState("tom");
  const [isDarkTheme, setDarkTheme] = useState(false);

  return (
    <Router>
      <BreakpointProvider>
        <IsDarkThemeContext.Provider value={{isDarkTheme, setDarkTheme}}>
          <NameContext.Provider value={{ personName, setPersonName }}>
            <div className={`App  light-theme`}>
              {/* <Breakpoint medium up>
            <LandingPage id="LandingPage" />
          </Breakpoint> */}
              <HeaderBar />
              <Body />
            </div>
          </NameContext.Provider>
        </IsDarkThemeContext.Provider>
      </BreakpointProvider>
    </Router>
  );
}

export default App;
