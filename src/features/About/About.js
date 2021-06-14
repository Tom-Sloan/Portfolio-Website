/*
Goal of component: About-> this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes.
  Gets paddle information, iterates over paddles and generates
*/

//Libraries
import React, { useRef, useEffect } from "react";
import styles from "./About.module.css";
import { useSelector } from "react-redux";
import { selectDivisions, selectIndexNumber } from "./aboutSlice";
import { Paddle } from "./Paddle";

export function About(props) {
  //Get paddle information
  const divisions = useSelector(selectDivisions);

  //Get which paddle is to be put on top
  const selected = useSelector(selectIndexNumber);

  //Used to set the height of the parent container of the paddles
  const fatherRef = useRef(null);

  //Used to set the element height of the paddle parent. This done by adding the heights of the
  //children that are absolute toeghter. Note, if anyother *unique* absolute children are added then they must be added.
  useEffect(() => {

    //get the child heights
    const svgHeight = getComputedStyle(
      document.querySelector(`.${styles.svgBtn}`)
    ).height;

    let divHeight = 0;
    document.querySelectorAll(`.${styles.content}`).forEach((elm) => {
      const height = Number(getComputedStyle(elm).height.slice(0, -2));
      if (height > divHeight) divHeight = height;
    });

    //Assign the calculated heights to the parent element
    fatherRef.current.style.height =
      Number(getComputedStyle(fatherRef.current).height.slice(0, -2)) +
      Number(svgHeight.slice(0, -2)) +
      divHeight +
      "px";
  }, [selected]);

  return (
    <div className={styles.divisionsConatiner}>
      {/* General About page, paddle independant */}
      <h1>About Me</h1>
      <p>
        Sunt aliqua eiusmod esse cupidatat nulla pariatur consequat quis.
        Nostrud do anim eiusmod do fugiat duis magna eiusmod. Id aliqua tempor
        occaecat enim mollit deserunt aliqua.
      </p>

      {/* ~Paddle start~ */}

      {/* Paddle Parent, used to position paddles in the view */}
      <div className={styles.father} ref={fatherRef}>
        {/* Generate Paddles */}
        {divisions.map((elm, index) => {
          /* 
          figure out the position of the paddle. It asumes the assumption that the goal 
          is for paddles before the selected one to be increading in z index and the ones agter to be decreasing
          */
          let zIndexValue = 0;
          if(index < selected)
            zIndexValue = index
          else if (index === selected)
            zIndexValue = divisions.length
          else if (index > selected)
            zIndexValue = divisions.length - index + selected

          return <Paddle zIndex={zIndexValue} elm={elm} index={index} numberOfPaddles={divisions.length}/>;
        })}
      </div>
    </div>
  );
}
