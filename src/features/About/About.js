/*
Goal of component: About-> this is the page itself. This is used for general about page
  information that is common to all options. This is also used for styling puposes.
  Gets paddle information, iterates over paddles and generates
*/

//Libraries
import React from "react";
import styles from "./About.module.css";
import { useSelector } from "react-redux";
import { selectDivisions, selectIndexNumber } from "./aboutSlice";
import { Paddle } from "./Paddle";

export function About(props) {
  //Get paddle information
  const divisions = useSelector(selectDivisions);

  //Get which paddle is to be put on top
  const selected = useSelector(selectIndexNumber);

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
      <div className={styles.father}> 
        {/* Paddle Titles */}
        <div className={styles.title}>
          {divisions.map((elm) => (
            <span className={styles.labelTexts}>{elm.title}</span>
          ))}
        </div>

        {/* Generate Paddles */}
        {divisions.map((elm, index) => {
          /* 
          figure out the position of the paddle. 
          0 is for non-selected paddles 1 & 3, 1 for non-selected paddle 2, 2 for active
          to make the code more universal with different number of paddles this has to change
          */
          let zIndexValue = selected === index ? 2 : 0;
          if (index === 1 && zIndexValue === 0) zIndexValue = 1;
          
          return <Paddle selected={zIndexValue} elm={elm} index={index} />;
        })}
      </div>
    </div>
  );
}

/*
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
