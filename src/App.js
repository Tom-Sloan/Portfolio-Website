import React from 'react';


import './App.css';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { HeaderBar } from './components/headerBar';
import { Body } from './components/body';
import { LandingPage } from './components/LandingPage/LandingPage'

function App() {
  return (
    <Router>
      <div className='App  light-theme '>
        <LandingPage />
        <HeaderBar />
        <Body />
      </div>
    </Router>
  );
}

export default App;


