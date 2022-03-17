import { pixelToNum } from "../../helpFunctions";
import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./HeaderStyles.module.css";
import { Link } from "react-router-dom";
import { HeaderButtons } from "./headerButtons";
export const CircleMenu = (list, selected, handleSelection) => {
  const circleRef = useRef(null);
  const getTopLeftLocation = (rx, ry, i, total, offset, clockwise) => {
    const scaleX = 1;
    const top =
      String(
        ry + -ry * Math.cos((360 / total / 180) * (i + offset) * Math.PI)
      ) + "px";
    const left =
      String(
        rx +
          (rx / scaleX) *
            (clockwise
              ? Math.sin((360 / total / 180) * (i + offset) * Math.PI)
              : -Math.sin((360 / total / 180) * (i + offset) * Math.PI))
      ) + "px";

    return {
      top: top,
      left: left,
      transform: `rotate(${
        (360 / total / 180) * (i + offset) * Math.PI + Math.PI / 2
      }rad)`,
    };
  };

  const circleData = {
    n: 14,
    rx: 150,
    ry: 150,
    so: 4,
    cw: true,
    wh: 100,
  };
  const circleTemp = Array(circleData.n).fill(0);
  const outerCircleStyle = {
    width: String(circleData.rx * 2 + circleData.wh) + "px",
    height: String(circleData.ry * 2 + circleData.wh) + "px",
  };
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastTouchMove, setLastTouchMove] = useState(null);
  const handleTouchMove = (e) => {
    if (lastTouchMove === null) {
      setLastTouchMove(e.touches);
      return;
    }
    console.log(lastTouchMove[0]);
    const currentTouch = e.touches;
    // console.log(currentTouch[0].pageY);
    // return
    // var rotation = e.rotation;

    // // This isn't a fun browser!
    // if ( ! rotation) {
    //      rotation = Math.arctan2(e.touches[0].pageY - e.touches[1].pageY,
    //            e.touches[0].pageX - e.touches[1].pageX) * 180 / Math.PI;
    // }

    // Take into account vendor prefixes, which I haven't done.
    const circleCoords = circleRef.current.getBoundingClientRect();
    const outerCircle = getComputedStyle(circleRef.current);
    const top = pixelToNum(outerCircle["top"]);
    const left = pixelToNum(outerCircle["left"]);

    const center = {
      x: pixelToNum(outerCircleStyle.width) / 2,
      y: pixelToNum(outerCircleStyle.height) / 2,
    };

    setToPosition(ref1, center.x, center.y);
    setToPosition(
      ref2,
      lastTouchMove[0].clientX - circleCoords.left,
      lastTouchMove[0].clientY - top
    );
    setToPosition(
      ref3,
      currentTouch[0].clientX - circleCoords.left,
      currentTouch[0].clientY - top
    );

    const centerToLast = distance(
      center.x,
      center.y,
      lastTouchMove[0].clientX - circleCoords.left,
      lastTouchMove[0].clientY
    );
    const centerToCurrent = distance(
      center.x,
      center.y,
      currentTouch[0].clientX - circleCoords.left,
      currentTouch[0].clientY
    );
    const lastToCurrent = distance(
      lastTouchMove[0].clientX - circleCoords.left,
      lastTouchMove[0].clientY,
      currentTouch[0].clientX - circleCoords.left,
      currentTouch[0].clientY
    );

    const theta =
      (Math.pow(centerToCurrent, 2) +
        Math.pow(centerToLast, 2) -
        Math.pow(lastToCurrent, 2)) /
      (2 * centerToCurrent * centerToLast);
    console.log(currentPosition);
    // const rotation = Math.acos()
    // const rotation = Math.atan2(lastTouchMove[0].pageY - currentTouch[0].pageY,
    //   lastTouchMove[0].pageX - currentTouch[0].pageX) * 180 / Math.PI;
    circleRef.current.style.transform =
      "rotate(" + (currentPosition + theta) + "deg)";
    // console.log(rotation)
    setLastTouchMove(currentTouch);
    setCurrentPosition((prev) => prev + theta);
  };
  useEffect(() => {
    console.log("loaded");
    var pointer = circleRef.current,
      pointerBox = pointer.getBoundingClientRect(),
      centerPoint = window.getComputedStyle(pointer).transformOrigin,
      centers = centerPoint.split(" ");

    function rotatePointer(e) {
      var pointerEvent = e;

      let mouseX, mouseY;
      if (e.targetTouches && e.targetTouches[0]) {
        e.preventDefault();
        pointerEvent = e.targetTouches[0];
        mouseX = pointerEvent.pageX;
        mouseY = pointerEvent.pageY;
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }

      var centerY = pointerBox.top + parseInt(centers[1]) - window.pageYOffset,
        centerX = pointerBox.left + parseInt(centers[0]) - window.pageXOffset,
        radians = Math.atan2(mouseX - centerX, mouseY - centerY),
        degrees = radians * (180 / Math.PI) * -1 + 180;
      pointer.style.transform = "rotate(" + degrees + "deg)";
    }

    window.addEventListener("mousemove", rotatePointer);
    window.addEventListener("touchmove", rotatePointer);
    window.addEventListener("touchstart", rotatePointer);
  }, []);

  const setToPosition = (reference, x, y) => {
    console.log(reference.current, x, y);
    reference.current.style.top = y + "px";
    reference.current.style.left = x + "px";
  };
  const distance = (x1, y1, x2, y2) =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  return (
    <div
      ref={circleRef}
      className={styles.outerCircle}
      style={outerCircleStyle}
      onClick={(e) => e.stopPropagation()}
      onTouchMove={e=>e.stopPropagation()}
      
    >
      <div
        ref={ref1}
        className={styles.pointMarker}
        style={{ background: "blue" }}
      ></div>
      <div
        ref={ref2}
        className={styles.pointMarker}
        style={{ background: "tomato" }}
      ></div>
      <div
        ref={ref3}
        className={styles.pointMarker}
        style={{ background: "green" }}
      ></div>

      {circleTemp.map((_, index) => {
        const el = list[index % list.length];
        const style = getTopLeftLocation(
          circleData.rx,
          circleData.ry,
          index,
          circleData.n,
          circleData.so,
          circleData.cw
        );

        return (
          <Link
            to={el.destination}
            key={el.title + "-link-" + index}
            className={styles.innerCircle}
            style={style}
          >
            <HeaderButtons
              name={el.title + "-" + index}
              text={el.title}
              key={el.title + "-" + index}
              selected={selected[index]}
              handleSelection={handleSelection}
              index={index}
              minified={true}
            />
          </Link>
        );
      })}
    </div>
  );
};

// .popUpCircleContainer{
//   display: none;
//   position: relative;

// }
// .outerCircle {
//   width: 400px;
//   height: auto;
//   transform-origin: center 50%;
//   display: block;
//   /* margin: 0 auto; */
//   touch-action: none;
//   /* background-color: beige; */
//   /* position: relative;
//   width: 500px;
//   height: 500px; */
//   position: fixed;
//   background-color: beige;
//   /* border-radius: 50%; */
//   top: 25%; 
//   left: 25%;
//   /* width: 500px; */
//   /* height: 500px; */
//   /* transform: rotate(20deg); */
  
// }
// .innerCircle {
//   /* background-color: aqua;
//   border-radius: 50%; */
//   /* width: 150px;
//   height: 150px; */
//   position: absolute;
//   color: papayawhip;
//   text-align: center;
//   font-family: "Open Sans Condensed", sans-serif;
//   /* border-radius: 50%; */
//   transition: transform 0.2s ease;
//   /* width: " + wh + " px; */
//   /* height: " + wh + " px; */
//   /* line-height: " + wh + " px; */
// }
// .pointMarker{
//   position: fixed;
//   width: 10px;
//   height: 10px;
//   top: 100px;
//   left:100px;
// }