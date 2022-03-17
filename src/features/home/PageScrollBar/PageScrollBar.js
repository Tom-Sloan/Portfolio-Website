import { useEffect, useState, useRef } from "react";
import styles from "./PageScrollBar.module.scss";
import {pixelToNum, vhToPixels, degrees_to_radians} from '../../../helpFunctions'

export function PageScrollBar() {
  const heightPercent = 0.15;
  const widthPercent = 0.9;
  const [height, setHeight] = useState(window.innerHeight * heightPercent);
  const [width, setWidth] = useState(window.innerWidth * widthPercent);
  const canvasHeight = height / 2;
  const minimum = 0.1;
  const limit = 0.9;
  const scale = 0.4;
  const requestRef = useRef();
  const percentPosition = useRef();
  const canvasContainerRef = useRef(null);

  //   const [percentPosition, setPercentPosition] = useState(0.9);
  //Make the angled lines
  const makeAngledLine = (
    ctx,
    centerX,
    centerY,
    length,
    angle = 20,
    innerScale = scale
  ) => {
    //get hypontenuse
    length = length * innerScale;
    const h = length / 2;

    const y = Math.cos(degrees_to_radians(angle)) * h;
    const x = Math.sin(degrees_to_radians(angle)) * h;

    const startx = centerX - x;
    const starty = centerY + y;

    const endx = centerX + x;
    const endy = centerY - y;

    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.stroke();
    return {
      startx: startx,
      starty: starty,
      endx: endx,
      endy: endy,
      centerX: centerX,
      centerY: centerY,
    };
  };


  const makeUpLine = (ctx, x, y, length, innerScale = scale) => {
    length = length * innerScale;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - length);
    ctx.stroke();

    return { startx: x, starty: y, endx: x, endy: y - length };
  };

  const getAvergedFromPosition = (x) =>
    (x - width * minimum) / (width * limit - width * minimum);

  const getPositionFromAverage = (percent) =>
    percent * (width * limit - width * minimum) + width * minimum;

  const makeBaseline = (ctx, length) => {
    length = length > width * limit ? width * limit : length;

    ctx.beginPath();
    ctx.moveTo(width * minimum, canvasHeight);
    ctx.lineTo(length, canvasHeight);
    ctx.stroke();
  };

  const makeTextAtPoint = (ctx, x, y, textX, textY) => {
    ctx.font = "20px serif";
    const text = Math.floor(getAvergedFromPosition(x) * 100) + "%";
    ctx.fillText(text, textX, textY);
  };

  const animatedProgessBar = () => {
    const canvas = document.getElementById("canvas");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeStyle = "rgba(0, 0, 200, 0.7)";
      ctx.fillStyle = "rgba(0, 0, 200, 0.7)";
      ctx.lineWidth = 5;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      makeBaseline(ctx, getPositionFromAverage(percentPosition.current));
      const positionMarker = makeAngledLine(
        ctx,
        getPositionFromAverage(percentPosition.current),
        canvasHeight,
        100
      );

      const positionTextMarker = makeUpLine(
        ctx,
        positionMarker.endx,
        positionMarker.endy,
        30
      );

      makeTextAtPoint(
        ctx,
        positionMarker.centerX,
        positionMarker.centerY,
        positionTextMarker.endx,
        positionTextMarker.endy
      );
      requestRef.current = requestAnimationFrame(animatedProgessBar);
    }
  };

  const action = (e) => {
    const scrollContainer = document.getElementById('HomeParentContainer')
    percentPosition.current =
      scrollContainer.scrollTop /
      (scrollContainer.scrollHeight - scrollContainer.clientHeight);
    const offset = Array.from(canvasContainerRef.current.children).reduce((prev, current) => pixelToNum(getComputedStyle(current)['height']) > prev ? pixelToNum(getComputedStyle(current)['height']): prev, 0)
    const defaultOffset =  (scrollContainer.scrollTop + scrollContainer.clientHeight -offset-10 )
    const limitOffset = (scrollContainer.scrollHeight - offset) - vhToPixels(10);
    canvasContainerRef.current.style.top =  Math.min(defaultOffset, limitOffset)  + 'px';
    
  };
  

  const initlizeCanvases = () => {
    console.log('here')
    const newWidth = window.innerWidth * widthPercent;
    const newHeight = window.innerHeight * heightPercent;

    setHeight(newHeight);
    setWidth(newWidth)
    const canvas = document.getElementById("canvas");
    const backgroundCanvas = document.getElementById("backgroundCanvas");

    if (canvas.getContext && backgroundCanvas.getContext) {
      const ctx = canvas.getContext("2d");
      const backgroundCanvasContext = backgroundCanvas.getContext("2d");

      ctx.canvas.width = newWidth;
      ctx.canvas.height = newHeight;
      backgroundCanvasContext.canvas.width = newWidth;
      backgroundCanvasContext.canvas.height = newHeight;
      
      backgroundCanvasContext.strokeStyle = "rgba(0, 0, 200, 0.7)";
      backgroundCanvasContext.fillStyle = "rgba(0, 0, 200, 0.7)";
      backgroundCanvasContext.lineWidth = 5;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      backgroundCanvasContext.clearRect(
        0,
        0,
        backgroundCanvasContext.canvas.width,
        backgroundCanvasContext.canvas.height
      );
      makeBaseline(backgroundCanvasContext, 100000);

      const endMarker = makeAngledLine(
        backgroundCanvasContext,
        width * limit,
        canvasHeight,
        100
      );
      const endTextMarker = makeUpLine(
        backgroundCanvasContext,
        endMarker.endx,
        endMarker.endy,
        30
      );
      makeTextAtPoint(
        backgroundCanvasContext,
        endMarker.centerX,
        endMarker.centerY,
        endTextMarker.endx,
        endTextMarker.endy
      );
      const startMarker1 = makeAngledLine(
        backgroundCanvasContext,
        width * minimum,
        canvasHeight,
        100
      );
      const startTextMarker1 = makeUpLine(
        backgroundCanvasContext,
        startMarker1.endx,
        startMarker1.endy,
        30
      );

      backgroundCanvasContext.strokeStyle = "rgba(255, 255, 255, 0.7)";
      backgroundCanvasContext.fillStyle = "rgba(255, 255, 255, 0.7)";

      const startMarker = makeAngledLine(
        backgroundCanvasContext,
        width * minimum,
        canvasHeight,
        100
      );
      const startTextMarker = makeUpLine(
        backgroundCanvasContext,
        startMarker.endx,
        startMarker.endy,
        30
      );

      makeTextAtPoint(
        backgroundCanvasContext,
        startMarker.centerX,
        startMarker.centerY,
        startTextMarker.endx,
        startTextMarker.endy
      );

      requestRef.current = requestAnimationFrame(animatedProgessBar);
    }
  };

  //function that gets the desired deboucing to work for on window resize
  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }
  useEffect(() => {
    initlizeCanvases();
    //Function to call on resize
    const deboucedUpdateWindowDimensions = debounce(initlizeCanvases, 1000);

    //Add window resize listener, this is so the user doesn't get stuck halfway between the standard site and the landingpage
    window.addEventListener("resize", deboucedUpdateWindowDimensions);
    const scrollContainer = document.getElementById('HomeParentContainer')

    scrollContainer.addEventListener("scroll", action);
    action();
    return () => {
      scrollContainer.removeEventListener("scroll", action);
      window.removeEventListener("resize", deboucedUpdateWindowDimensions);
    };
  }, []);

  return (
    <div ref={canvasContainerRef} className={styles.canvasContainer}>
      <canvas
        id="backgroundCanvas"
        className={`${styles.canvas} ${styles.backgroundCanvas}`}
      ></canvas>
      <canvas id="canvas" className={styles.canvas}></canvas>
    </div>
  );
}
