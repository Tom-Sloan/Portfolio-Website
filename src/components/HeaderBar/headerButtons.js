import React, { useRef } from "react";
import styles from "./HeaderButtons.module.css";
// import "./styles.css";

export function HeaderButtons({ name, text, selected }) {
  const ref = useRef(null);
  const spanRef = useRef(null);

  console.log(ref.current);

  function handleEnter(e) {
    console.log("eneter");
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

    console.log(spanRef.current.classList);
    console.log(getComputedStyle(spanRef.current));
  }
  function handleOut(e) {
    console.log("leave");
    let parentOffset = ref.current.getBoundingClientRect();
    let relX = e.pageX - parentOffset.left;
    let relY = e.pageY - parentOffset.top;

    console.log(spanRef.current.classList);
    spanRef.current.style.top = relY + "px";
    spanRef.current.style.left = relX + "px";

    spanRef.current.style.height = "0px";
    spanRef.current.style.width = "0";
    // console.log(getComputedStyle(spanRef.current))
    console.log(relX);
    console.log(relY);
  }

  return (
    <div key={name} className={styles.SubredditButtonContainer}>
      <button
        ref={ref}
        className={`${styles.SubredditButton} ${
          selected ? styles.activeBtn : ""
        }`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleOut}
      >
        {text}
        <span className={styles.SubredditButtonSpan} ref={spanRef}></span>
      </button>
    </div>
  );
}
