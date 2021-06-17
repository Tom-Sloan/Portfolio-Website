import React from "react";
import styles from "./About.module.css";

export function TestData({numberOfRepeat}) {
  
  return (
    <div>
      <div
        className={styles.inactiveLink}
      >
        {Array(numberOfRepeat).fill().map((v,i)=> <p>Officia incididunt qui Lorem esse quis excepteur deserunt nisi veniam
        aliquip irure. Tempor velit deserunt reprehenderit exercitation esse
        nulla non pariatur qui excepteur. Dolor non ad veniam et aliqua labore</p>)}
        
      </div>
      {/* <div className={styles.poligon}>
        <img src="http://lorempixel.com/g/600/400/" />
      </div> */}
    </div>
  );
}
