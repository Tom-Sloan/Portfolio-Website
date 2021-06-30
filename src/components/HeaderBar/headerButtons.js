import React, { useRef } from "react";
import styles from "./HeaderButtons.module.css";
// import "./styles.css";

export function HeaderButtons({ name, text, selected, handleSelection, index, minified=false }) {
  const ref = useRef(null);
  const spanRef = useRef(null);

  function handleEnter(e) {

    let parentOffset = ref.current.getBoundingClientRect();
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;

    // console.log(spanRef.current);
    // spanRef.current.style.top = relY + "px";
    // spanRef.current.style.left = relX + "px";

    spanRef.current.style.top = relY + "px";
    spanRef.current.style.left = relX + "px";

    spanRef.current.style.height = "300%";
    spanRef.current.style.width = "225%";


  }
  function handleOut(e) {

    let parentOffset = ref.current.getBoundingClientRect();
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;

    spanRef.current.style.top = relY + "px";
    spanRef.current.style.left = relX + "px";

    spanRef.current.style.height = "0px";
    spanRef.current.style.width = "0";

  }
  return (
    <div key={name} className={minified?styles.minifiedButtonContainer:styles.SubredditButtonContainer}>
      <button
        ref={ref}
        className={`${minified?styles.minifiedButton:styles.SubredditButton} ${
          selected ? styles.activeBtn : ""
        }`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleOut}
        onClick={(e) => handleSelection(e, index)}
      >
        {text}
        <span className={styles.SubredditButtonSpan} ref={spanRef}></span>
      </button>
    </div>
  );
}
