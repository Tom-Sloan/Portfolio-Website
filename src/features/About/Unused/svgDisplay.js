/*
PaddleJs is made up of two parts:
1. The stylized svgs that lead into the content and act like fancy tabs

####REQUIRED CSS########
.paddleSvg {
  position: absolute;
  width: 0;
  height: 0;
  top: 0;
  left: 0;
}

.svgBtn {
  background: var(--dark);
  position: absolute;
  top: 0;
  padding: 0;
  border-width: 0;
}
.svgDiv {
  width: 100%;
  height: 100%;
  margin: 0 0;
}


#######DEMO#########
const elms = [
  {
    title:'title1'
  },
  {
    title:'title2'
  },
]

const paths = [
    "M0,1 L0,0 L0.667,0 Q0.667,1,1,1 L0,1",
    "M0.167,1 L1,1 Q0.833,1,0.833,0 L0.167,0 Q0.167,1,0,1 L0.167,1",
    "M0,1 L1,1 L1,0 L0.333,0 Q0.333,1,0,1",
  ];
elms.map((elm, index) =>{
  const positionType = index === 0 ? 0 : index === divisions.length - 1 ? 2 : 1;

  const element = {
      title: ...elm,
      path: paths[positionType],
      color: colors[index] || generateRandomColors(1)[0],
    };

  return (<PaddleTop
    elm={element}
    index={index}
    numberOfPaddles={divisions.length}
  /> )
})

*/



import React, { useRef, useEffect } from "react";
import styles from "./BubbleTilesController.module.css";

export function PaddleTop({ elm, index, numberOfPaddles }) {
  const divRef = useRef(null);
  const borderRef = useRef(null);

  const selectionPosition =  index === 0 ? 0 : index === numberOfPaddles - 1 ? 2 : 1;

  const titleGridLocation = {
    width: "100%",
    textAlign:['left', 'center',"right"][selectionPosition],
    fontSize: "3rem",
    margin:['0 40px', '0', '0 40px 0 0'][selectionPosition],
    float:['left', 'center', 'right'][selectionPosition]
  };

  useEffect(() => {
    const width = 100 / numberOfPaddles;
    const delta =
      index === 0
        ? 0
        : index === numberOfPaddles - 1
        ? (width * 3) / 2 - width 
        : ((width * 3) / 2 - width) / 2;

    let borderStyle = {
      clipPath: "url(#clipPath" + index + ")",
      height: 30 + "vh",
      width: (width * 3) / 2 + "%",
      left: width * index - delta + "%",
    };

    let style = {
      background: elm.color,
      clipPath: "url(#clipPath" + index + ")",
      gridTemplateColumns: `repeat(${numberOfPaddles}, minmax(0, 1fr))`,
      left: "5%",
      width: "100%",
      height: "100%",
      margin: "0 0",
    };

    Object.entries(style).forEach(([key, value]) => {
      divRef.current.style[key] = value;
    });
    Object.entries(borderStyle).forEach(([key, value]) => {
      borderRef.current.style[key] = value;
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div style={{visibility:'hidden'}}>
      {/* https://yoksel.github.io/relative-clip-path/ */}
      {/* https://codepen.io/anthonydugois/full/mewdyZ */}
      {/* Paddle Titles */}
      <svg className={styles.paddleSvg}>
        <clipPath id={"clipPath" + index} clipPathUnits="objectBoundingBox">
          <path d={elm.path}></path>
        </clipPath>
      </svg>

      {/* <div style={{ border: "2px dotted turquoise" }}> */}
      <button className={styles.svgBtn} ref={borderRef} >
        <div className={styles.svgDiv} ref={divRef}>
          <p style={titleGridLocation} className={styles.tileTitles}>
            {elm.title}
          </p>
        </div>
      </button>
      {/* </div> */}
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
