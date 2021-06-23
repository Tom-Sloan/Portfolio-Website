import React from "react";
import styles from "./BubbleTilesController.module.css";

export function Bubbles({
  elm,
  numberOfPaddles,
  toggleAnimation,
  handleSelection,
  name
}) {
  //Diameter of bubble (in vh)
  const diameter = 10;
  /* 
    Gets the value that will deside if a bubble is on the right or left side of the vertical middle. 
    This uses the number of bubbles (which is equal to number of paddles).
    
    An example of this working for odd numbers:5 bubbles, 5/2 is 2.5, 2.5 floored is 2. Treat 2 as the middle index and center everything around it.
    this is correct since an array of length 5 has index of 0-4 and the middle is 2. (same result as #bubbles - 1 then divided by 2 )

    An example of this working for an even number: 6 bubbles, 6/2 is 3, 3 - 0.5 is 2.5. Treat all bubbles with an index of less than 2.5 as left and more as right.
    this gives three per side. then when delta is calculated, 2.5 - index will have an extra half per side => 2.5-2 = 0.5 and abs(2.5-3) = 0.5. This will
    give and extra gap of 1 in the middle and since 1 is the standard gap the spacing will work out. 
  */
  const middleIndex =
    numberOfPaddles % 2
      ? Math.floor(numberOfPaddles / 2)
      : numberOfPaddles / 2 - 0.5;

  //Position type is the direction on either side of the middle bubble, to the left is 0 to the right is 2 and the middle bubble is 1. An even number of bubbles
  // will not have a value as 1 because the middleIndex calculated will be an float
  const positionType =
    elm.index < middleIndex ? 0 : elm.index > middleIndex ? 2 : 1;

  //number of bubbles (includeing the bubble doing the calculation) that are between this bubble and the middle bubble
  const delta = Math.abs(middleIndex - elm.index);

  //Figure out what scale to apply to the tile
  let transform = "";
  if (toggleAnimation) {
    transform = elm.OnScreen ? `scale(1.25)` : "";
  } else {
    transform = elm.isSelected ? `scale(1.25)` : `scale(1)`;
  }

  //Style to apply to the bubble. These are all the dynamic styling elements (dependant on props), other styling options are in styles.Bubbles
  const style = {
    backgroundColor: elm.color, //Color to set the bubble
    width: `90px`, //width of the bubble
    height: `90px`, //height of the bubble

    /*
      how far left the bubble should be. It is 10% in the vertical display format.
      For the horizontal positioning, the values are centered around 50% of the parent coponent (which is 100% of the screen). if they are from the right side,
      they go farther right, left side they are father left. the middle index is set to the middle
    */
    left: !toggleAnimation
      ? [
          `calc(50% - ${diameter * delta}% - ${2 * delta}%)`,
          "50%",
          `calc(50% + ${diameter * delta}% + ${2 * delta}%)`,
        ][positionType]
      : "calc(10% - 45px)",

    /*
      how far away the bubble should be from the top. It is 40px in horizontal display format.
      for the vertical positioning, there is a 40px buffer added to the top so the highest bubble will not be agains the header
      then for each bubble, its top calculated by adding all the diameters of the bubbles that preceded it plus a gap of 2 between each of those bubbles
    */
    top: toggleAnimation
      ? `calc(40px + ${90 * elm.position}px + ${2 * elm.position}vh)`
      : "15%",
    //Pass in the calculated transform
    transform: transform,

    //There are two animations because we want the transitions to play in reverse when we get back to the top
    transition: toggleAnimation
      ? "transform 0.2s ease-out, top 0.6s ease-out 0.6s, left 0.6s ease-out"
      : "transform 0.2s ease-out, top 0.6s ease-out, left 0.6s ease-out 0.6s",
  };

  //Sets the selected variable to be the given index if we are in the horizontal alignment
  const handleEnter = (e, index) => {
    if (!toggleAnimation) handleSelection(index);
  };

  return (
    //Anchor tag so the bubbles are clickable and slide you down to the proper section nicely
    <a
      href={"#paddle-" + elm.index}
      onMouseEnter={(e) => handleEnter(e, elm.index)}
    >
      {/* the bubbles */}
      <div style={style} className={`${styles.Bubbles} ${styles.Bubbles+name}`}>
        {/* title with default value */}
        <p>{elm.title || ""}</p>
      </div>
    </a>
  );
}
