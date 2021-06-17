import React from 'react';


import './App.css';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import { HeaderBar } from './components/headerBar';
import { Body } from './components/body';

function App() {
  return (
    <Router>
      <div className='App  light-theme '>
        <HeaderBar />
        <Body />
      </div>
    </Router>
  );
}

export default App;


