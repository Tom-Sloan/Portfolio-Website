import React from "react";
import styles from "./BubbleTilesController.module.css";

export function Tiles({ elm }) {
  // For the colored part of the tile
  //The dynamic part of the style of the tile to be created
  const tileStyle = {
    backgroundColor: elm.color,
  };

  // For the title that is outside the colored part
  //The dynamic part of the title. The title is position on the left, with text align to the right.
  //This change in width gives the movement to the title labels
  const titleLocation = {
    width: !(elm.position % 2) ? "100%" : "0",
  };

  //For the entire tile with both the floating title and the coloured tile
  const style = {
    transform: !(elm.position % 2)
      ? `translate3d(${0}px, ${elm.height}px, ${2 + "px"})`
      : `translate3d(100px, ${elm.height}px, ${-2 + "px"})`,
  };

  return (
    //The entire tile, given a id so the bubble links will connect with them
    <div
      
      className={`${styles.contentContainer}`}
      style={style}
    >
      {/* Title */}
      <h2 id={"paddle-" + elm.index} style={titleLocation} className={styles.tileTitles}>
        {elm.title}
      </h2>

      {/* Colour tile */}
      <div className={styles.content} style={tileStyle}>
        {elm.element}
      </div>
    </div>
  );
}
