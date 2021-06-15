import React from "react";
import styles from "./About.module.css";

export function LeadBlock({ index, title='', numberOfPaddles, color }) {
    const width = (100 / (numberOfPaddles)) ;
    
    const style={
        backgroundColor:color,
        width: width + 0.01 + "%",
        left: width*index + '%',
        top:'0',
    }

    return(
        <div style={style} className={styles.LeadBlock}>{title}</div>
    );
}