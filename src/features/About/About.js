/*
Goal of component: About-> this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes.
  Gets tile information, iterates over tiles and generates

  definitions:
  Paddle/Tile -> the hovering div that moves around
  Position    -> Each tile has a position = The number of Paddles(-1) subtract the number of other tiles that have been referenced
                  since the last time this tile has been selected. 0 is the tile at the top of the view, #tiles-1 is the one at the bottom
  Selected    -> The tile that is at the top of the view
*/

//Libraries
import React, { useRef, useEffect, useState } from "react";
import styles from "./About.module.css";
import { useSelector } from "react-redux";

//Information that will be displayed
import { selectDivisions, selectIndexNumber } from "./aboutSlice";

//The two parts of the design.
import { PaddleBody } from "./PaddleBody"; // This contains the paddles/tiles code
import { LeadBlock } from "./LeadBlock"; // contains the floating bubble code

//Used in case someone makes a verison with more than the number of hardcoded nice colors that I selected
import { generateRandomColors } from "./helpFunctions";

export function About({ parentPosition, toggleAnimation }) {
  //Get tile information
  const divisions = useSelector(selectDivisions);

  //Get which tile is to be put on top
  const selected = useSelector(selectIndexNumber);

  //Used to set the height of the parent container of the tiles
  const fatherRef = useRef(null);

  //Used to maintain a consistent color for each tile in the event of >5 tiles being created
  const [colors, setColors] = useState([
    "#006a4e",
    "#2e856e",
    "#5ca08e",
    "#8abaae",
    "#b8d5cd",
  ]);

  //Used to determine the gap between the tiles AND the distance between the bubbles and the selected tile
  const offset = 100;

  //Contains the positions of the tiles after the last update
  const [lastChecked, setLastChecked] = useState([]);

  //Contains the heights of each tile
  const [tileHeights, setPaddleHeights] = useState([]);

  //Convert a number string with 2 chars at the end to a number e.g. '153px' => 153
  const pixelToNum = (i) => Number(i.slice(0, -2));

  //Used to update the Positions of the tiles
  useEffect(() => {
    //Update positions on selection change. This works by increasing the position of all lower positions than
    //the one selected and ignoring the rest
    const temp = lastChecked.map((position) =>
      position < lastChecked[selected] ? position + 1 : position
    );

    //Set the selected one to the lowerest position number
    temp[selected] = 0;

    //Updating the positions variable
    setLastChecked([...temp]);
  }, [selected]);

  //1. Used to Setup Inital Positions of the tiles
  //2. to set the element height of the tile parent element (father)
  //3. To offset the tile parent elemnt to give the bubbles space
  // 2 & 3 are done by adding the heights of the children that are absolute toeghter.
  // Note, if any other *unique* absolute children are added then they must be added.
  useEffect(() => {
    //function that gets toggled on window resize
    const updateWindowDimensions = () => {
      //Get leadBlock height to offset the tile parent element
      const leadBlock = getComputedStyle(
        document.querySelector(`.${styles.LeadBlock}`)
      );

      //get the height of the leadBlock Element
      let leadBlockHeight =
        pixelToNum(leadBlock.height) + pixelToNum(leadBlock.top);

      let cummulativeDivHeight = 0; // all div hights plus their offset
      let divHeights = []; //stores new div hights temperaly

      document.querySelectorAll(`.${styles.content}`).forEach((elm) => {
        const height = pixelToNum(getComputedStyle(elm).height); // height of the tile without offset
        cummulativeDivHeight += height + offset; //adding the height of the tile with offset to the control variable
        divHeights.push(height); //adding the tile height to the termporary storage
      });

      //storing div height for later reference
      setPaddleHeights([...divHeights]);

      //Assign the calculated heights to the parent element
      fatherRef.current.style.top = leadBlockHeight + "px"; // assigns the offset so the tiles are not on top of the bubbles
      fatherRef.current.style.height = offset * 2 + cummulativeDivHeight + "px"; // set the height of the parent element.
      //offset is *2=> offset # 1 is for a gap of offset sizwat the bottom .
      //Offset #2 is for the offset that added as an additional space at the top. I may remove that second offset if you can't find in which case the gap will be two offset in size from the bottom of the last tile to the footer
    };

    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();

    //insert the initial values for positions of the tiles
    const temp = [];
    for (let i = 0; i < divisions.length; i++) {
      temp.push(i);
    }

    setLastChecked([...temp]);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  //Get a random color if the number of colors is more than the hardcoded amount amount
  if (colors.length < divisions.length) {
    setColors((prev) => [
      ...prev,
      ...generateRandomColors(divisions.length - prev.length),
    ]);
  }

  //Calculates the height the tile show be placed at. This is because the tiel will be at variying locations based on the
  //position it is in and because different tiles will be different thicknesses
  const getCummHeight = (tileNum) => {
    //In case it is an invalid call
    if (tileNum < 0 || tileNum > divisions.length)
      return (fatherRef.current && fatherRef.current.clientHeight) || 0;

    let height = 0; //height control variable

    const position = lastChecked[tileNum]; //get position of tile
    for (let i = 0; i < position; i++) {
      const indexOfPosition = lastChecked.indexOf(i);
      height += tileHeights[indexOfPosition] + offset;
    }
    return height;
  };

  return (
    <div className={styles.divisionsContainer}>
      <div className={styles.bubbleContainer}>
        {divisions.map((elm, index) => {
          const element = {
            ...elm,
            color: colors[index] || generateRandomColors(1)[0],
          };
          let OnScreen = false;
          if (toggleAnimation) {
            const position = lastChecked[index];
            const indexOfPosition = lastChecked.indexOf(position + 1);
            OnScreen =
              getCummHeight(indexOfPosition) >= parentPosition &&
              getCummHeight(index) <= parentPosition;
          }
          return (
            <LeadBlock
              index={index}
              title={element.title}
              numberOfPaddles={divisions.length}
              color={element.color}
              isSelected={index === selected && !toggleAnimation}
              toggleAnimation={toggleAnimation}
              OnScreen={OnScreen}
            />
          );
        })}
      </div>

      {/* Paddle Parent, used to position tiles in the view */}
      <div className={styles.father} ref={fatherRef}>
        {/* Generate Paddles */}
        {divisions.map((elm, index) => {
          const element = {
            ...elm,
            color: colors[index] || generateRandomColors(1)[0],
          };

          const position = lastChecked[index] || 0;
          // const height = getCummHeight(index) + offset || 0;
          const height = getCummHeight(index) || 0;

          const style = {
            transform: !(position % 2)
              ? `translate3d(${0}px, ${height}px, ${2 + "px"})`
              : `translate3d(100px, ${height}px, ${-2 + "px"})`,
          };

          return (
            <div className={`${styles.mother}`}>
              <PaddleBody
                elm={element}
                index={index}
                numberOfPaddles={divisions.length}
                position={position}
                transform={style}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
