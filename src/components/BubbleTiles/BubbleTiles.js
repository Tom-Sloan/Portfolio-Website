/*
BubbleTiles in the entry point for a user using this code.

It requires:
titles: An array which contains the title to be used in both the bubbles and above the tile. Default is blank, give '' for no title
element: An arry which contains the contents of the tiles. This varibale controls the number of tiles, the other two have defaults if insufficient inputs are given
colors: An arry which contains the colors to be used in the bubble and tile backgrounds.

*/

import React, { useState, useRef } from "react";
import { BubbleTilesController } from "./BubbleTilesController";
import { Footer } from "../FooterBar/footerBar";
import styles from "./BubbleTilesController.module.css";

export function BubbleTiles({visualData}) {
  
  //Used to detect when the user is scrolling to trigger the bubbles animation. Scrolling is used instead of observer
  //because we need to know the user position to trigger the bubble size increase on scrolling when their corresponding element is
  //in view of the screen

  //Contians the last position of the user inside parentRef
  const [lastScroll, setLastScroll] = useState(0);

  const [clientHeight, setClientHeight] = useState(0);

  //Control variable to dictate when the bubbles are in vertical (true) or horizontal position (false)
  const [toggleAnimation, setToggleAnimation] = useState(false)
  
  //Used to reference the component we want to get the scroll position of
  const parentRef = useRef(null);

  //On scroll handler
  const handleScroll = (e) => {
    //Get current scroll position
    const currentScroll = parentRef.current.scrollTop;
    const horizontalBoundary = 10;
    //If we are within an area of the top of the screen, bubbles are in horizontal position 
    if (currentScroll <= horizontalBoundary) {
      //Only change if we are currently in other state
      if (toggleAnimation)
        setToggleAnimation(false)
    }
    //If we are going down and are below the boundary
    if (currentScroll > lastScroll && currentScroll > horizontalBoundary) {
      //Only change if we are currently in other state
      if (!toggleAnimation)
        setToggleAnimation(true)
    }
    //Record current position
    setLastScroll(currentScroll);
    setClientHeight(e.target.clientHeight)
  };
  
  return (
    <div ref={parentRef} className={styles.parent} onScroll={handleScroll}>
      <BubbleTilesController parentPosition={lastScroll} parentHeight = {clientHeight} toggleAnimation={toggleAnimation} name={visualData.name} displayItems={visualData.displayData || {}} offset={visualData.offset || 100}/>
      <Footer />
    </div>
  );
}
