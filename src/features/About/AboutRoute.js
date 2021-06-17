import React, { useState, useRef } from "react";
import { About } from "./About";
import { Footer } from "../../components/footerBar";
import styles from "../../components/headerStyles.module.css";

export function AboutRoute() {
  const [lastScroll, setLastScroll] = useState(0);
  const [toggleAnimation, setToggleAnimation] = useState(false)
  const parentRef = useRef(null);
  const handleScroll = (e) => {
    const currentScroll = parentRef.current.scrollTop;
    if (currentScroll <= 10) {
      // console.log('here')
      // console.log(toggleAnimation)
      if (toggleAnimation)
        setToggleAnimation(false)
    }
    if (currentScroll > lastScroll) {
      // down
      if (!toggleAnimation)
        setToggleAnimation(true)
    }
    setLastScroll(currentScroll);
    // console.log(currentScroll)
  };

  return (
    <div ref={parentRef} className={styles.parent} onScroll={handleScroll}>
      <About parentPosition={lastScroll} toggleAnimation={toggleAnimation} />
      <Footer />
    </div>
  );
}
