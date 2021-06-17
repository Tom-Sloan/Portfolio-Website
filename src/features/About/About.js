/*
Goal of component: About-> this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes.
  Gets paddle information, iterates over paddles and generates
*/
/*
The overal structure of the about section has 4 main parts:
1. About route: this used to differeniate btwn the subsections avaliable. 
  This is what is used to make the svgs clickable and to change z-index.
  this can moved to the parent componenet but it is here for clarity.

2. About: this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes

3. Paddle: this are the svgs and content containers. Each option had its own paddle
  component. inside of here is the styling and setup to make the paddles have shaped 
  svgs and to be clickable to the link in 1. 

4. (*Option): these files are the setup elements that are inside each paddle and contain the 
  relevant information to each option.
*/
//Libraries
import React, { useRef, useEffect, useState } from "react";
import styles from "./About.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectDivisions, selectIndexNumber } from "./aboutSlice";
import { PaddleTop } from "./PaddleTop";
import { PaddleBody } from "./PaddleBody";
import { LeadBlock } from "./LeadBlock";
import { updateIndex } from "./aboutSlice";
import { generateRandomColors } from "./helpFunctions";

export function About({ parentPosition, toggleAnimation }) {
  //Get paddle information
  const divisions = useSelector(selectDivisions);

  //Get which paddle is to be put on top
  const selected = useSelector(selectIndexNumber);

  //Used to set the height of the parent container of the paddles
  const fatherRef = useRef(null);

  //Used to maintain a consistent color for each paddle
  const [colors, setColors] = useState([
    "#006a4e",
    "#2e856e",
    "#5ca08e",
    "#8abaae",
    "#b8d5cd",
  ]);
  const offset = 100;
  const [lastChecked, setLastChecked] = useState([]);
  const [paddleHeights, setPaddleHeights] = useState([]);

  const paths = [
    "M0,1 L0,0 L0.667,0 Q0.667,1,1,1 L0,1",
    "M0.167,1 L1,1 Q0.833,1,0.833,0 L0.167,0 Q0.167,1,0,1 L0.167,1",
    "M0,1 L1,1 L1,0 L0.333,0 Q0.333,1,0,1",
  ];

  const pixelToNum = (i) => Number(i.slice(0, -2));
  //Used to update the Positions of the paddles
  useEffect(() => {
    //Setup Inital Positions
    let temp = lastChecked.map((position, index) => {
      return position < lastChecked[selected] ? position + 1 : position;
    });
    temp[selected] = 0;
    setLastChecked([...temp]);
  }, [selected]);

  //Used to Setup Inital Positions of the paddles and to set the element height of the paddle parent. This done by adding the heights of the
  //children that are absolute toeghter. Note, if anyother *unique* absolute children are added then they must be added.
  useEffect(() => {
    const updateWindowDimensions = () => {
      //get the child heights adn ajust with screen size change
      const leadBlock = getComputedStyle(
        document.querySelector(`.${styles.LeadBlock}`)
      );
      let leadBlockHeight =
        pixelToNum(leadBlock.height) + pixelToNum(leadBlock.top);

      let cummulativeDivHeight = 0;
      let divHeights = [];

      document.querySelectorAll(`.${styles.content}`).forEach((elm) => {
        const height = Number(getComputedStyle(elm).height.slice(0, -2));
        cummulativeDivHeight += height + offset;
        divHeights.push(height);
      });
      setPaddleHeights([...divHeights]);

      //Assign the calculated heights to the parent element
      fatherRef.current.style.top = leadBlockHeight + "px";
      fatherRef.current.style.height = 400 + cummulativeDivHeight + "px";
    };

    window.addEventListener("resize", updateWindowDimensions);
    updateWindowDimensions();

    //insert the intial values for positions
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
  const getCummHeight = (tileNum) => {
    if (tileNum===-1) return fatherRef.current && fatherRef.current.clientHeight || 0;
    let height = 0;
    const position = lastChecked[tileNum];
    for (let i = 0; i < position; i++) {
      const indexOfPosition = lastChecked.indexOf(i);
      // console.log('TileNum' + i + '\tHigherTileNum: ' + indexOfPosition)
      height += paddleHeights[indexOfPosition] + offset;
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
          if (toggleAnimation){
            const position = lastChecked[index];
            const indexOfPosition = lastChecked.indexOf(position+1);
            OnScreen =   getCummHeight(indexOfPosition) >= parentPosition && getCummHeight(index) <= parentPosition;
            console.log('index: '+ index + '\t' + OnScreen + '\t' + Math.floor(getCummHeight(indexOfPosition)) + '' + (getCummHeight(indexOfPosition) >= parentPosition) + '\t' + Math.floor(getCummHeight(index)) + (getCummHeight(index) <= parentPosition) +'\t' + Math.floor(parentPosition));
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

      {/* Paddle Parent, used to position paddles in the view */}
      <div className={styles.father} ref={fatherRef}>
        {/* Generate Paddles */}
        {divisions.map((elm, index) => {
          const positionType =
            index === 0 ? 0 : index === divisions.length - 1 ? 2 : 1;

          const element = {
            ...elm,
            path: paths[positionType],
            color: colors[index] || generateRandomColors(1)[0],
          };

          const position = lastChecked[index] || 0;
          const height = getCummHeight(index) + offset || 0;

          const style = {
            transform: !(position % 2)
              ? `translate3d(${0}px, ${height}px, ${2 + "px"})`
              : `translate3d(100px, ${height}px, ${-2 + "px"})`,
          };

          return (
            <div className={`${styles.mother}`}>
              {/* <PaddleTop
                elm={element}
                index={index}
                numberOfPaddles={divisions.length}
              /> */}
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
