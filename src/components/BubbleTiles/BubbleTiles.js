/*
BubbleTiles in the entry point for a user using this code.

It requires:
name (string): this will be used for all document.querySElector calls so should be unique to instance. there is a default name ('default')
offset (int): This is the distance between the tiles 
displayData (array of objects):
  -> Objects contain
      title : the title to be used in both the bubbles and floating above the tile. Default is no tilte if not given
      componenet : The contents of the tiles, default is no content for tile, in such a case the tile will be padding tall
      color: Contains the color to be used in the bubble and tile backgrounds. There is a random color generator if this is not given, however, the color may (probably) be ugly
      hasHorizontal: this controlls whether the bubbles go into a horizontal display or not

*/

import React, { useState, useRef } from "react";
import { BubbleTilesController } from "./BubbleTilesController";
import { Footer } from "../FooterBar/footerBar";
import styles from "./BubbleTilesController.module.scss";

export function BubbleTiles({visualData}) {
  
  //Used to detect when the user is scrolling to trigger the bubbles animation. Scrolling is used instead of observer
  //because we need to know the user position to trigger the bubble size increase on scrolling when their corresponding element is
  //in view of the screen

  //Contians the last position of the user inside parentRef
  const [lastScroll, setLastScroll] = useState(0);

  const [clientHeight, setClientHeight] = useState(0);

  //Control variable to dictate when the bubbles are in vertical (true) or horizontal position (false)
  const [toggleAnimation, setToggleAnimation] = useState(visualData.hasOwnProperty('hasHorizontal')?!visualData.hasHorizontal:false)
  
  //Used to reference the component we want to get the scroll position of
  const parentRef = useRef(null);

  //On scroll handler
  const handleScroll = (e) => {
    //Get current scroll position
    const currentScroll = parentRef.current.scrollTop;
    const hasHorizontal = visualData.hasOwnProperty('hasHorizontal')?visualData.hasHorizontal:true;
    const horizontalBoundary = hasHorizontal?10:-100;
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
    <div ref={parentRef} className={`${styles.parent}`} onScroll={handleScroll}>
      <BubbleTilesController parentPosition={lastScroll} parentHeight = {clientHeight} toggleAnimation={toggleAnimation} name={visualData.name} displayItems={visualData.displayData || {}} offset={visualData.offset || 100} hasHorizontal={visualData.hasOwnProperty('hasHorizontal')?!visualData.hasHorizontal:false}/>
      <Footer />
    </div>
  );
}
