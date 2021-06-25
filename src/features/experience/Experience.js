import { useSelector } from 'react-redux';
import styles from './Experience.module.css';
import resumeStyle from '../resume/Resume.module.css';
import { selectExperienceArray } from './experienceSlice';
import { useEffect } from "react";

export function Experience() {
    const experiences = useSelector(selectExperienceArray);

    const updateWindowDimensions = () => {
        console.log("HELLO!");
    }

    function isScrolledIntoView(elem) {
        var docViewTop = document.querySelector(
            `.${resumeStyle.parent}`
        ).scrollTop;
        var docViewBottom =
            docViewTop +
            document.querySelector(`.${resumeStyle.parent}`).offsetHeight;

        var elemTop = elem.offsetTop;
        // var elemBottom = Math.max(
        //     elemTop + elem.offsetHeight,
        //     elemTop + window.screen.height / 2
        // );
        var elemBottom = elemTop + elem.offsetHeight;

        // console.log(docViewTop);
        // console.log(docViewBottom);
        // console.log(elemTop);
        // console.log(elemBottom);

        return elemBottom <= docViewBottom && elemTop >= docViewTop;
    }

    useEffect(() => {
        // console.log("Is this even happening");

        const updateTimeline = () => {
            try {
                const children = document.querySelector(`.${styles.experienceList}`).children;
                // console.log(getComputedStyle(document.querySelector(`.${styles.experienceList}`)).marginTop);

                Array.from(
                    children
                ).forEach((elem) => {
                    if (isScrolledIntoView(elem)) {
                        if (document.getElementById(`circle ${elem.id}`)) {
                            document.getElementById(
                                `circle ${elem.id}`
                            ).style.backgroundColor = "#00dae6";
                        }
                    } else {
                        if (document.getElementById(`circle ${elem.id}`)) {
                            document.getElementById(
                                `circle ${elem.id}`
                            ).style.backgroundColor = '#00adb5' /*"#2fc1f2"*/;
                        }
                    }
                });

                var winScroll = document.querySelector(`.${resumeStyle.parent}`).scrollTop;
                var height = document.querySelector(`.${styles.experienceContainer}`).offsetHeight - children[children.length - 1].offsetHeight - (window.innerHeight * 0.05);
                // console.log(document.querySelector(`.${styles.experienceContainer}`).offsetHeight);
                // console.log(window.innerHeight);
                // console.log(height);
                var scrolled = (winScroll / height) * 100;

                if (scrolled >= 100) {
                    document.getElementById('timeline_bar').style.height = "100%";
                } else {
                    document.getElementById('timeline_bar').style.height = scrolled + "%";
                }

            } catch (e) {
                console.log(e);
            }
        }

        // console.log(document.querySelector(`.${resumeStyle.parent}`));

        document
            .querySelector(`.${resumeStyle.parent}`)
            .addEventListener("scroll", updateTimeline);

        try {
            console.log("ME");
            updateTimeline();
        } catch (e) {
            console.log(e);
        }
    }, []);

    useEffect(() => {
        window.addEventListener("resize", updateWindowDimensions);

        try {
            updateWindowDimensions();
        } catch (e) {
            console.log(e);
        }

        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, []);

    const handleHover = (e) => {
        e.target.style.backgroundColor = "#00dae6";
    };

    const handleNoHover = (e) => {
        e.target.style.backgroundColor = "#00adb5";
    };

    return (
        <div className={styles.experienceContainer} >
            <div className={styles.experiences} >
                <div className={styles.timelineContainer} >
                    <div className={styles.progressContainer}>
                        <div className={styles.progressBar} id='timeline_bar' ></div>
                    </div>
                    {experiences.length > 0 && experiences.map((data, idx) => (
                        <div className={styles.timelineItem} >
                            <div className={styles.timelineContent} >
                                <a
                                    href={`#data ${idx}`}
                                    className={styles.circleLink}
                                    onMouseEnter={handleHover}
                                    onMouseLeave={handleNoHover}
                                >
                                    <span
                                        className={styles.timelineCircle}
                                        id={`circle data ${idx}`}
                                    />
                                </a>

                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.experienceList} onChange={updateWindowDimensions} >
                    {experiences.length > 0 && experiences.map((data, idx) => (
                        <div className={styles.experience} id={`data ${idx}`} >
                            <img src={data.image} alt="" />
                            <h1>{data.workplace}</h1>
                            <h2>{data.title}</h2>
                            <time>{data.date} - {data.enddate}</time>
                            <ul>
                                {data.tasks.length > 0 && data.tasks.map((item) => (
                                    <li>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}