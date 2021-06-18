// import styles from './Resume.module.css';
// import React, { useState } from 'react';
import { useEffect, useState } from "react";

export function Resume() {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    })

    const updateWindowDimensions = () => {
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    useEffect(() => {
        window.addEventListener("resize", updateWindowDimensions);
        updateWindowDimensions();

        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, []);

    return (
        <div style={{ height: '78vh', textAlign: 'center', fontSize: '20px' }} >
            {console.log({ dimensions })}
            <object data='./Daniel_Neasmith_CV.pdf#zoom=100' type='application/pdf' width='90%' height='100%' >
                {/* <embed src='./Daniel_Neasmith_CV.pdf#zoom=100' type='application/pdf' height='10%' /> */}
                <p style={{ paddingTop: '30vh' }} >Oops! Your browser doesn't support PDFs!</p>
                <p><a href="./Daniel_Neasmith_CV.pdf" target='_blank' >Download Instead</a></p>
            </object>
            {/* <h1>Resume</h1> */}
            {/* <iframe title='Resume' src='./Daniel_Neasmith_CV.pdf#zoom=100' width='90%' height='100%' ></iframe> */}
        </div>
    );
}