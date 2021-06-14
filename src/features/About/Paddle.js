import React, { useRef, useEffect } from "react";
import styles from "./About.module.css";
import { useSelector, useDispatch } from "react-redux";
import { updateIndex } from "./aboutSlice";

export function Paddle({ elm, selected, index }) {
  const divRef = useRef(null);
  const borderRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let borderStyle = {
      zIndex: selected,
      background: "black",
      clipPath: "url(#clipPath" + index + ")",
      position: "absolute",
      width: "90%",
      top: 0,
      height: "40vh",
      backgroundSize: "cover",
      left: index * 5 + "%",
    };
    let style = {
      zIndex: selected,
      background: elm.color,
      clipPath: "url(#clipPath" + index + ")",
      position: "absolute",
      width: "99%",
      top: "1%",
      left: "7px",
      height: "40vh",
      backgroundSize: "cover",
      // left: index * 5 + "%",
      // borderTop: `1px solid ${elm.color}`,
    };

    Object.entries(style).forEach(([key, value]) => {
      divRef.current.style[key] = value;
    });
    Object.entries(borderStyle).forEach(([key, value]) => {
      borderRef.current.style[key] = value;
    });
  }, [selected]);
  const activeDivStyle = {
    backgroundColor: elm.color,
    zIndex: selected,
    position: "absolute",
    // left: shift[index],
    left: index * 2.5 + "%",
    cursor: selected === 2 ? "default" : "pointer",
  };

  const destination = "http://localhost:3000/about/" + index;
  const handleClick = (e) => {
    if (selected !== 2) {
      dispatch(updateIndex({index: index}))
      console.log("changing");
    }
  };

  return (
    <div >
      {/* https://yoksel.github.io/relative-clip-path/ */}
      {/* https://codepen.io/anthonydugois/full/mewdyZ */}

      <svg className={styles.paddleSvg}>
        <clipPath id={"clipPath" + index} clipPathUnits="objectBoundingBox">
          <path d={elm.path}></path>
        </clipPath>
      </svg>

      <button onClick={handleClick}>
        <div ref={borderRef}>
          <div ref={divRef}></div>
        </div>
      </button>
      {
        <div
          onClick={handleClick}
          className={styles.content}
          style={activeDivStyle}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={styles.inactiveLink}
          >
            Ullamco magna commodo occaecat veniam laboris mollit duis laboris
            duis nulla proident nulla et sit. Irure laboris mollit dolor
            proident officia consectetur nostrud est. Elit mollit consectetur
            est magna consectetur irure magna adipisicing. Nostrud exercitation
            excepteur ex dolor aute cupidatat quis Lorem. Enim quis culpa sunt
            esse velit consectetur elit Lorem fugiat amet. In dolor do ut tempor
            labore dolore dolor et consequat ullamco officia. Tempor adipisicing
            sint ad duis ex cupidatat irure. Ea do Lorem aute aute nostrud
            laboris sunt non nulla occaecat ipsum pariatur quis. Enim dolore
            culpa laborum officia reprehenderit esse incididunt minim. Ipsum
            occaecat irure reprehenderit ea do cillum irure voluptate ullamco
            sit ut. Ipsum aliqua culpa deserunt fugiat id esse commodo non
            occaecat ea commodo do. Elit id ex dolore eiusmod tempor Lorem
            fugiat. Officia ex fugiat laborum proident ea laboris cillum officia
            consequat. Irure quis ad adipisicing cupidatat fugiat sunt et
            exercitation in esse ut. Occaecat mollit laboris nulla amet
            cupidatat tempor cillum aliqua est quis exercitation officia. Velit
            qui culpa anim sit ex eiusmod fugiat ex cillum. Ad aliqua
            exercitation adipisicing et esse cillum. Ullamco veniam ullamco
            dolor anim nulla labore magna fugiat tempor. Quis aute cupidatat
            magna pariatur duis incididunt voluptate magna ut sunt esse
            voluptate est. Pariatur ut ad tempor fugiat aute nulla voluptate
            mollit tempor. Aute eiusmod consequat sunt aute et duis incididunt
            officia ut nisi ut esse magna consectetur. Laborum incididunt
            officia occaecat occaecat Lorem. Eu magna sint deserunt mollit duis
            velit sunt ut. Pariatur id tempor culpa excepteur officia minim
            irure ea aliquip proident eu eiusmod in anim. Qui ipsum fugiat
            labore consequat labore esse ullamco. Reprehenderit exercitation
            fugiat adipisicing sint amet veniam. Eiusmod duis quis deserunt et
            ut id Lorem fugiat duis mollit eu laboris. Deserunt nulla eiusmod do
            minim. Sit aute eiusmod eiusmod elit amet occaecat nulla occaecat
            veniam ut. Velit consequat qui minim cillum ipsum officia proident
            nisi ad. Ad reprehenderit irure anim culpa. Mollit aliquip est sunt
            nulla dolor ut qui proident. Sunt aliquip fugiat ipsum nostrud sit
            ipsum laboris non anim. Aliquip duis labore ad anim. Pariatur
            officia labore laborum fugiat id. Eu esse ipsum aliquip duis labore
            ea commodo anim sint culpa consectetur. Eiusmod culpa eiusmod ea
            consequat tempor. Dolor fugiat consequat proident ad duis non dolore
            mollit veniam tempor laboris. Anim in et in non id ea. Cupidatat ex
            duis nisi proident. Sit ea ea aliquip qui cupidatat velit excepteur
            occaecat ipsum est mollit voluptate eu. Sint nostrud et enim ullamco
            proident mollit amet nostrud est ut reprehenderit dolore
            reprehenderit adipisicing. Exercitation ipsum culpa mollit esse.
            Minim occaecat ullamco cillum mollit ipsum irure cillum nostrud.
            Amet tempor aliquip mollit sunt enim sunt ipsum esse labore laboris
            minim in. Velit labore anim mollit mollit velit occaecat sint. Ea
            culpa ex voluptate cupidatat aute velit occaecat excepteur cupidatat
            sint ullamco dolore. Veniam aliqua occaecat voluptate pariatur.
            Pariatur ea velit aute dolor. Sunt ad do quis cillum esse qui mollit
            velit est consectetur exercitation irure fugiat. Adipisicing
            deserunt nulla anim nulla velit commodo. Adipisicing voluptate
            pariatur laborum laboris ullamco et aliquip cillum fugiat labore
            exercitation. Consectetur eu sint labore magna ex voluptate occaecat
            nulla. Officia velit dolor tempor pariatur ullamco reprehenderit
            sint. Minim sunt reprehenderit non ipsum exercitation dolor est quis
            elit do cillum. Ullamco magna commodo occaecat veniam laboris mollit
            duis laboris duis nulla proident nulla et sit. Irure laboris mollit
            dolor proident officia consectetur nostrud est. Elit mollit
            consectetur est magna consectetur irure magna adipisicing. Nostrud
            exercitation excepteur ex dolor aute cupidatat quis Lorem. Enim quis
            culpa sunt esse velit consectetur elit Lorem fugiat amet. In dolor
            do ut tempor labore dolore dolor et consequat ullamco officia.
            Tempor adipisicing sint ad duis ex cupidatat irure. Ea do Lorem aute
            aute nostrud laboris sunt non nulla occaecat ipsum pariatur quis.
            Enim dolore culpa laborum officia reprehenderit esse incididunt
            minim. Ipsum occaecat irure reprehenderit ea do cillum irure
            voluptate ullamco sit ut. Ipsum aliqua culpa deserunt fugiat id esse
            commodo non occaecat ea commodo do. Elit id ex dolore eiusmod tempor
            Lorem fugiat. Officia ex fugiat laborum proident ea laboris cillum
            officia consequat. Irure quis ad adipisicing cupidatat fugiat sunt
            et exercitation in esse ut. Occaecat mollit laboris nulla amet
            cupidatat tempor cillum aliqua est quis exercitation officia. Velit
            qui culpa anim sit ex eiusmod fugiat ex cillum. Ad aliqua
            exercitation adipisicing et esse cillum. Ullamco veniam ullamco
            dolor anim nulla labore magna fugiat tempor. Quis aute cupidatat
            magna pariatur duis incididunt voluptate magna ut sunt esse
            voluptate est. Pariatur ut ad tempor fugiat aute nulla voluptate
            mollit tempor. Aute eiusmod consequat sunt aute et duis incididunt
            officia ut nisi ut esse magna consectetur. Laborum incididunt
            officia occaecat occaecat Lorem. Eu magna sint deserunt mollit duis
            velit sunt ut. Pariatur id tempor culpa excepteur officia minim
            irure ea aliquip proident eu eiusmod in anim. Qui ipsum fugiat
            labore consequat labore esse ullamco. Reprehenderit exercitation
            fugiat adipisicing sint amet veniam. Eiusmod duis quis deserunt et
            ut id Lorem fugiat duis mollit eu laboris. Deserunt nulla eiusmod do
            minim. Sit aute eiusmod eiusmod elit amet occaecat nulla occaecat
            veniam ut. Velit consequat qui minim cillum ipsum officia proident
            nisi ad. Ad reprehenderit irure anim culpa. Mollit aliquip est sunt
            nulla dolor ut qui proident. Sunt aliquip fugiat ipsum nostrud sit
            ipsum laboris non anim. Aliquip duis labore ad anim. Pariatur
            officia labore laborum fugiat id. Eu esse ipsum aliquip duis labore
            ea commodo anim sint culpa consectetur. Eiusmod culpa eiusmod ea
            consequat tempor. Dolor fugiat consequat proident ad duis non dolore
            mollit veniam tempor laboris. Anim in et in non id ea. Cupidatat ex
            duis nisi proident. Sit ea ea aliquip qui cupidatat velit excepteur
            occaecat ipsum est mollit voluptate eu. Sint nostrud et enim ullamco
            proident mollit amet nostrud est ut reprehenderit dolore
            reprehenderit adipisicing. Exercitation ipsum culpa mollit esse.
            Minim occaecat ullamco cillum mollit ipsum irure cillum nostrud.
            Amet tempor aliquip mollit sunt enim sunt ipsum esse labore laboris
            minim in. Velit labore anim mollit mollit velit occaecat sint. Ea
            culpa ex voluptate cupidatat aute velit occaecat excepteur cupidatat
            sint ullamco dolore. Veniam aliqua occaecat voluptate pariatur.
            Pariatur ea velit aute dolor. Sunt ad do quis cillum esse qui mollit
            velit est consectetur exercitation irure fugiat. Adipisicing
            deserunt nulla anim nulla velit commodo. Adipisicing voluptate
            pariatur laborum laboris ullamco et aliquip cillum fugiat labore
            exercitation. Consectetur eu sint labore magna ex voluptate occaecat
            nulla. Officia velit dolor tempor pariatur ullamco reprehenderit
            sint. Minim sunt reprehenderit non ipsum exercitation dolor est quis
            elit do cillum.
          </div>
          <div className={styles.poligon}>
            <img src="http://lorempixel.com/g/600/400/" />
          </div>
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
