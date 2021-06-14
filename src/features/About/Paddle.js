import React, { useRef, useEffect } from "react";
import styles from "./About.module.css";
import { useDispatch } from "react-redux";
import { updateIndex } from "./aboutSlice";
import { TestData } from "./AboutTestOption";

export function Paddle({ elm, zIndex, index, numberOfPaddles }) {
  const divRef = useRef(null);
  const borderRef = useRef(null);
  const dispatch = useDispatch();

  const activeDivStyle = {
    backgroundColor: elm.color,
    zIndex: zIndex,
    left: index * 2.5 + "%",
    cursor: zIndex === 2 ? "default" : "pointer",
    top: 50 +  zIndex + 'vh',
  };

  const titleGridLocation = {
    gridColumn: index + 1 + "/span 1",
    width: '90%',
    border: '2px dashed yellow',
    margin: '0 5px',
    overflow:'hidden',
    fontSize: '3rem',
  };

  useEffect(() => {

    console.log('here' + index)

    let borderStyle = {
      zIndex: zIndex,
      clipPath: "url(#clipPath" + index + ")",
      height: 38 +  zIndex + 'vh',
    };
    console.log(borderStyle.height)
  
    let style = {
      zIndex: zIndex,
      background: elm.color,
      clipPath: "url(#clipPath" + index + ")",
      gridTemplateColumns: `repeat(${numberOfPaddles}, minmax(0, 1fr))`,
      // borderTop: `1px solid ${elm.color}`,
    };

    Object.entries(style).forEach(([key, value]) => {
      divRef.current.style[key] = value;
    });
    Object.entries(borderStyle).forEach(([key, value]) => {
      borderRef.current.style[key] = value;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zIndex]);

  const handleClick = (e) => {
    //not do anything if currently the top one
    if (zIndex !== numberOfPaddles) {
      dispatch(updateIndex({ index: index }));
    }
  };

  return (
    <div>
      {/* https://yoksel.github.io/relative-clip-path/ */}
      {/* https://codepen.io/anthonydugois/full/mewdyZ */}
      {/* Paddle Titles */}

      <svg className={styles.paddleSvg}>
        <clipPath id={"clipPath" + index} clipPathUnits="objectBoundingBox">
          <path d={elm.path}></path>
        </clipPath>
      </svg>

      <button className={styles.svgBtn} ref={borderRef} onClick={handleClick}>
        <div className={styles.svgDiv} ref={divRef}>
          <span style={titleGridLocation} className={styles.labelTexts}>
            {elm.title}
          </span>
        </div>
      </button>

      {
        <div
          onClick={handleClick}
          className={styles.content}
          style={activeDivStyle}
        >
          <TestData />
          {index === 2 && <TestData />}
        </div>
      }
    </div>
  );
}

/*

Code where I was trying to find when the mouse enter the svg to change the z-index

  const [slideIndex, setSlideIndex] = useState(1);
  const [circleX, setCircleX] = useState(0);
  const [circleY, setCircleY] = useState(0);

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);
  // Next/previous controls
  function plusSlides(n) {
    console.log("here3:" + n);
    setSlideIndex((prev) => prev + n);
  }

  // Thumbnail image controls
  function currentSlide(n) {
    console.log("hereL:" + n);
    setSlideIndex(n);
  }

  function showSlides(n) {
    let i;
    let slides = document.querySelectorAll(".mySlides");
    let dots = document.querySelectorAll(".dot");
    console.log("A->slideIndex: " + slideIndex);
    console.log(slides);
    console.log(dots);
    console.log(n);
    if (n > slides.length) {
      console.log("here1");
      setSlideIndex(1);
    } else if (n < 1) {
      console.log("here2: " + slides.length);
      setSlideIndex(slides.length);
    } else {
      console.log(getComputedStyle(slides[slideIndex - 1])["z-index"]);
      for (i = 0; i < slides.length; i++) {
        slides[i].style.zIndex = "1";
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      console.log("B->slideIndex: " + slideIndex);
      slides[slideIndex - 1].style.zIndex = "2";
      dots[slideIndex - 1].className += " active";
      console.log(getComputedStyle(slides[slideIndex - 1])["z-index"]);
    }
  }
<svg
            width="480"
            height="320"
            style={{ border: "2px solid blue" }}
            className={`${styles.svg} mySlides`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox={elm.position}
          >
            <a href="#" cursor="pointer" pointerEvents="fill">
              <path
                className="path"
                fill={elm.color}
                fill-opacity="1"
                d={elm.path}
              ></path>
            </a>
            {/* <circle
                className="stroke-point"
                cx={circleX}
                cy={circleY}
                r="2.5"
                fill="red"
              /> */
/* <circle id="stroke-point" cx="400" cy="320" r="2.5" fill="red" /> */
/*</svg>

    // const realLocation = point.matrixTransform(
    //   svgs[index].getScreenCTM().inverse());
    // setCircleX(realLocation.x);
    // setCircleY(realLocation.y);
    // console.log("Paths: " + inPath[0] + "\t" + inPath[1] + "\t" + inPath[2]);
    // console.log("");

    
  const handleMove = (e) => {
    let paths = document.querySelectorAll(".path");
    let svgs = document.querySelectorAll(".mySlides");
    // console.log('Paths')
    // console.log(paths)
    const inPath = [];

    paths.forEach((path, index) => {
      let point = svgs[index].createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;

      inPath.push(path.isPointInFill(point) || path.isPointInStroke(point));
    });

  };
 */
