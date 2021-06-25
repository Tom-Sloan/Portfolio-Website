/*
Goal of component: BubbleTilesController-> this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes.
  Gets tile information, iterates over tiles and generates

  Definitions:
  Paddle/Tile -> the hovering div that moves around
  Position    -> Each tile has a position = The number of Paddles(-1) subtract the number of other tiles that have been referenced
                  since the last time this tile has been selected. 0 is the tile at the top of the view, #tiles-1 is the one at the bottom
  Selected    -> The tile that is at the top of the view
*/

//Libraries
import React, { useRef, useEffect, useState } from "react";
import styles from "./BubbleTilesController.module.css";
import playlistStyles from '../../features/Spotify/Playlists.module.css';

//The two parts of the design.
import { Tiles } from "./Tiles"; // This contains the paddles/tiles code
import { Bubbles } from "./Bubbles"; // contains the floating bubble code
import { NextBack } from "./NextBack";

//Used in case someone makes a verison with more than the number of hardcoded nice colors that I selected
import { generateRandomColors, pixelToNum, getCSSGlobalVar } from "../../helpFunctions";

export function BubbleTilesController({
  parentPosition,
  toggleAnimation,
  displayItems,
  name = "default",
  parentHeight,
  offset = 100,
}) {
  //Get tile information
  const numberOfBubbleTiles = displayItems.length;

  //Get which tile is to be put on top
  // let selected = useSelector(selectIndexNumber);
  const [selected, setSelected] = useState(0);

  //Used to set the height of the parent container of the tiles
  const fatherRef = useRef(null);

  //Used to maintain a consistent color for each tile in the event of >5 tiles being created
  const [colors, setColors] = useState([]);

  //Contains the positions of the tiles after the last update
  const [lastChecked, setLastChecked] = useState([]);

  //Contains the heights of each tile
  const [tileHeights, setTileHeights] = useState([]);

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

  const updateFatherDimensions = () => {
    let checkingOffset = offset;
    if (window.innerWidth <= 850) checkingOffset = 40;
    //Get bubbles height to offset the tile parent component
    const bubbles = getComputedStyle(
      document.querySelector(`.${styles.Bubbles + name}`)
    );

    //get the height of the bubbles Element
    let bubblesHeight = pixelToNum(bubbles.height) + pixelToNum(bubbles.top);

    let cummulativeDivHeight = 0; // all div hights plus their offset
    let divHeights = []; //stores new div hights temperaly

    document
      .querySelectorAll(`.${styles.contentContainer + name}`)
      .forEach((elm) => {
        const height = pixelToNum(getComputedStyle(elm).height); // height of the tile without offset
        cummulativeDivHeight += height + checkingOffset; //adding the height of the tile with offset to the control variable
        divHeights.push(height); //adding the tile height to the termporary storage
      });

    //storing div height for later reference
    setTileHeights([...divHeights]);

    // Assign the calculated heights to the parent component.
    // This has to be done bc the sticky element doesn't impact parent height since it is not a scrolling neigbour
    document.querySelector(
      `.${styles.divisionsContainer + name}`
    ).style.height =
      checkingOffset + cummulativeDivHeight + bubblesHeight + "px";

    // fatherRef.current.style.top = bubblesHeight + "px"; // assigns the offset so the tiles are not on top of the bubbles
    fatherRef.current.style.height =
      checkingOffset + cummulativeDivHeight + "px"; // set the height of the parent component. Offset give an extra space at the bottom
  };

  //1. Used to Setup Inital Positions of the tiles
  //2. to set the components height of the tile parent components (father)
  //3. To offset the tile parent elemnt to give the bubbles space
  //4. To increase the parent component of both the tiles and bubbles to be their size put together plus an offset at the bottom
  // 2 & 3 are done by adding the heights of the children that are absolute toeghter.
  // 5. Get the colors for any tiles missing colors
  // Note, if any other *unique* absolute children are added then they must be added.
  useEffect(() => {
    //function that gets toggled on window resize


    window.addEventListener("resize", updateFatherDimensions);
    updateFatherDimensions();

    //insert the initial values for positions of the tiles
    const temp = [];
    for (let i = 0; i < numberOfBubbleTiles; i++) {
      temp.push(i);
    }

    setLastChecked([...temp]);

    //Get colors for elements missing colors
    const colorTemp = [];
    for (const _ in displayItems) {
      colorTemp.push(generateRandomColors(1)[0]);
    }

    //Get a random color if the number of colors is more than the hardcoded amount amount
    setColors(colorTemp);

    //Removes the event listener so this function is not called on resize changes not on the BubbleTile page
    return () => window.removeEventListener("resize", updateFatherDimensions);
  }, []);

  // const term = document.querySelector(`.${playlistStyles.spotifyParent}`) ? document.querySelector(`.${playlistStyles.spotifyParent}`).children.length : 0 ;

  // useEffect(() => {
  //   console.log("Term switch");
  //   updateFatherDimensions();
  // }, [term])

  //Calculates the height the tile show be placed at. This is because the tile will be at variying locations based on the
  //position it is in and because different tiles will be different thicknesses
  const getCummHeight = (tileNum) => {
    //In case it is an invalid call, returns the bottom of the parent
    if (tileNum < 0 || tileNum > numberOfBubbleTiles)
      return (fatherRef.current && fatherRef.current.clientHeight) || 0;

    let height = 0; //height control variable

    const position = lastChecked[tileNum]; //get position of tile we are investigating

    //Gets the heights of the tiles that are at lower positions then the tile we are investigating, adds the offset between each
    for (let i = 0; i < position; i++) {
      const indexOfPosition = lastChecked.indexOf(i);
      height += tileHeights[indexOfPosition] + offset;
    }
    return height;
  };

  //Calculates the current tile on screen, this works for when the tiles are ordered only (therefore not when they are doing 3d translates)
  const getOnScreen = () => {
    let height = 0;
    // This returns the first index where the currenltly parentPosition (scroll distance from top for parent) is less than the height of the current tile plus all tha preceed it.
    //e.g. if tileHeight=[10, 10 , 10] and the parentPosition is 15, then index 1 is returned since 15<20 and 15>10 
    for (let i = 0; i < displayItems.length; i++) {
      height += tileHeights[i];
      if (parentPosition + parentHeight / 4 < height) return i;
    }

    //This is returned by default so there is no error
    return displayItems.length - 1;
  };

  const nextBackStyle = {
    top: parentPosition + "px",
  };

  return (
    // Division container contains three parts, first the Arrows that appear when the screen is small, second the bubbles (which disapear with a small screen), third the tiles
    <div
      className={`${styles.divisionsContainer} ${styles.divisionsContainer + name
        }`}
    >
      {/* Make the floating toggle btns for modile and small screens */}
      <div style={nextBackStyle} className={styles.nextBackButtons}>
        <NextBack
          numberOfPaddles={numberOfBubbleTiles}
          visibleTile={getOnScreen()}
        />
      </div>

      {/* Start of bubble section */}
      <div className={styles.bubbleContainer}>
        {/* Iterating over the provided components */}
        {displayItems.map((elm, index) => {
          // Onscreen is the variable that changes as the user scrolls down. If this variable is true, the bubble gets larger. It
          // is set to true when the component that we are curretnly iterating over is in on screen
          let OnScreen = false;

          //Get the position of the component
          const position = lastChecked[index];

          // We are checking to see if the current component is the one on screen. The way we do this is by comparing the current scoll position (from parentPosition)
          // with the locaion of the tile. We know the locations of the tiles because we store their heights in tileHeights state variable. If the parent
          // is at a location of the tile to the next tile the onscreen will be true. This works for the last positioned tile because getCummHeight returns the parent height for invalid indexes
          // toggleAnimation is the variable that controls whether the bubbles are in their vertical (true) or horizontal (false) display mode
          if (toggleAnimation) {
            //get Index of the tile in the next position
            const indexOfPosition = lastChecked.indexOf(position + 1);

            //Check to see if parentPosition is in the range
            OnScreen =
              getCummHeight(indexOfPosition) >= parentPosition &&
              getCummHeight(index) <= parentPosition;
          }

          //Create the object with required parts for Bubbles
          const component = {
            title: elm.title, //Title to be displayed inside bubble
            index: index, //Index of the component
            isSelected: index === selected, //if the component is selected (no impact if not in horizontal view)
            OnScreen: OnScreen, //if the component is on screen (no impact if in verical view)
            color: elm.color || colors[index], //color to make bubble
            position: position,
          };

          return (
            <Bubbles
              key={"Bubble-" + index}
              elm={component}
              numberOfPaddles={numberOfBubbleTiles}
              toggleAnimation={toggleAnimation}
              handleSelection={setSelected}
              name={name}
            />
          );
        })}
      </div>

      {/* Start of TileSection */}
      {/* Paddle Parent, used to position tiles in the view */}
      <div className={styles.father} ref={fatherRef} >
        {/* Generate Paddles */}
        {displayItems.map((elm, index) => {
          const position = lastChecked[index] || 0;

          // const height = getCummHeight(index) + offset || 0;
          const height = getCummHeight(index) || 0;

          const component = {
            element: elm.component,
            color: elm.color || colors[index], //color to make bubble
            title: elm.title, //Title to be displayed above tile
            position: position, //current position of tile, this is used to control the text alignment of the title (width of the element is adjusted so alignment can be transitioned)
            index: index, //index of component
            height: height, // the distance the component should be from the top of the parent component
          };

          return <Tiles key={"tile-" + index} elm={component} name={name} updateFatherDimensions={updateFatherDimensions} />;
        })}
      </div>
    </div>
  );
}
