import styles from "./Projects.module.css";
import bodyStyle from "../../components/BodyStyles.module.css";
import footerStyle from "../../components/FooterBar/FooterStyles.module.css";
import { useSelector } from "react-redux";
import React, { useContext, useEffect } from "react";
import { selectProjectsArray } from "./projectsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import VanillaTilt from "vanilla-tilt";
import { IsDarkThemeContext, NameContext } from "../../AllContexts";

export function Projects({ background, cleanup }) {
    const projects = useSelector(selectProjectsArray)[useContext(NameContext).personName];
    const {isDarkTheme, setDarkTheme}  = useContext(IsDarkThemeContext);
    // console.log(projects);

    useEffect(() => {
        const options = {
            reverse: true,
            // glare: true,
            // 'max-glare': 0.5,
            max: 10,
        }
        const element = document.querySelectorAll(`.${styles.tiltCard}`);
        VanillaTilt.init(element, options);

        // element.addEventListener("tiltChange", callback);
    }, []);
    const makeBackground = () => {
        cleanup();
        background();
    }
    const updateWindowDimensions = () => {
        document.querySelector(`.${bodyStyle.parallax}`).style.height =
            getComputedStyle(document.querySelector(`.${styles.projectList}`)).height;
        document.querySelector(`.${bodyStyle.parallax}`).style.width =
            getComputedStyle(document.querySelector(`.${bodyStyle.bodyArea}`)).width;
        document.querySelector(`.${styles.page}`).style.height = getComputedStyle(
            document.querySelector(`.${styles.projectList}`)
        ).height;
        document.querySelector(`.${styles.page}`).style.width = getComputedStyle(
            document.querySelector(`.${bodyStyle.bodyArea}`)
        ).width;

        

        // document.querySelector(`${bodyStyle.parallax}`).children[0].width = getComputedStyle(document.querySelector(`.${bodyStyle.parallax}`).style.width)
        // document.querySelector(`${bodyStyle.parallax}`).children[0].height = getComputedStyle(document.querySelector(`.${bodyStyle.parallax}`).style.height)

        // document.document.querySelector(`.${styles.page}`).style.height
        // console.log(getComputedStyle(document.querySelector(`.${styles.projectList}`)).height);
        // console.log(getComputedStyle(document.querySelector(`.${styles.page}`)).height)
        // console.log(document.querySelector(`.${styles.projectList}`).children);
        // console.log(document.querySelector(`.${styles.projectList}`).children)
    };

    // useEffect(() => {
    //     const updateTimeline = () => {
    //         try {
    //             Array.from(
    //                 document.querySelector(`.${styles.projectList}`).children
    //             ).forEach((elem) => {
    //                 if (isScrolledIntoView(elem)) {
    //                     if (document.getElementById(`circle ${elem.id}`)) {
    //                         document.getElementById(
    //                             `circle ${elem.id}`
    //                         ).style.backgroundColor = "#00dae6";
    //                     }
    //                 } else {
    //                     if (document.getElementById(`circle ${elem.id}`)) {
    //                         document.getElementById(
    //                             `circle ${elem.id}`
    //                         ).style.backgroundColor = "#00adb5"; //"#2fc1f2"
    //                     }
    //                 }
    //             });

    //             var winScroll = document.querySelector(
    //                 `.${bodyStyle.parallaxParent}`
    //             ).scrollTop;
    //             var height =
    //                 document.querySelector(`.${styles.page}`).offsetHeight -
    //                 document.querySelector(`.${bodyStyle.parallaxParent}`).offsetHeight +
    //                 document.querySelector(`.${bodyStyle.footer}`).offsetHeight;
    //             var scrolled = (winScroll / height) * 100;
    //             document.getElementById("my_bars").style.height = scrolled + "%";
    //             console.log(e);
    //         }
    //     };

    //     console.log(document.querySelector(`.${bodyStyle.parallaxParent}`));

    //     //THIS

    //     document
    //         .querySelector(`.${bodyStyle.parallaxParent}`)
    //         .addEventListener("scroll", updateTimeline);

    //     try {
    //         updateTimeline();
    //     } catch (e) {
    //         console.log(e);
    //     }

    //     // return () => document.querySelector(`.${bodyStyle.parallaxParent}`).removeEventListener('scroll', updateTimeline);
    // }, []);

    // function isScrolledIntoView(elem) {
    //     var docViewTop = document.querySelector(
    //         `.${bodyStyle.parallaxParent}`
    //     ).scrollTop;
    //     var docViewBottom =
    //         docViewTop +
    //         document.querySelector(`.${bodyStyle.parallaxParent}`).offsetHeight;

    //     var elemTop = elem.offsetTop;
    //     var elemBottom = elemTop + elem.offsetHeight;

    //     console.log(docViewTop);
    //     console.log(docViewBottom);
    //     console.log(elemTop);
    //     console.log(elemBottom);

    //     return elemBottom <= docViewBottom && elemTop >= docViewTop;
    // }

    // const handleHover = (e) => {
    //     e.target.style.backgroundColor = "#00dae6";
    // };

    // const handleNoHover = (e) => {
    //     e.target.style.backgroundColor = "#00adb5";
    // };

    function debounce(fn, ms) {
        let timer;
        return (_) => {
            clearTimeout(timer);
            timer = setTimeout((_) => {
                timer = null;
                fn.apply(this, arguments);
            }, ms);
        };
    }

    const resizeFunction = () => {
        updateWindowDimensions();
        makeBackground()
    }

    const debounceResize = () => {
        debounce(resizeFunction(), 1000)
    }

    useEffect(() => {
        window.addEventListener("resize", debounceResize);

        try {
            updateWindowDimensions();
            background();
        } catch (e) {
            console.log(e);
        }

        // console.log(document.querySelector(`.${styles.projectList}`).children[3]);

        return () => window.removeEventListener("resize", debounceResize);
    }, []);

    // function isScrolledIntoView(elem) {
    //     var docViewTop = document.querySelector(`.${bodyStyle.bodyArea}`).scrollTop;
    //     var docViewBottom = docViewTop + getComputedStyle(document.querySelector(`.${styles.projectList}`)).height;

    //     var elemTop = getComputedStyle(elem).offset;
    //     var elemBottom = elemTop + getComputedStyle(elem).height;

    //     console.log(elem);
    //     console.log(docViewTop);
    //     console.log(docViewBottom);
    //     console.log(elemTop);
    //     console.log(elemBottom);

    //     return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    // }

    // const handleScroll = (e) => {
    //     console.log(isScrolledIntoView(document.querySelector(`.${styles.projectList}`).children[3]));
    // }

    return (
        //https://www.freecodecamp.org/news/how-to-create-a-timeline-component-with-react-1b216f23d3d4/
        <div className={styles.page}>
            <div className={styles.projectContainer}>
                <div className={styles.projects}>
                    {/* <div className={styles.timelineContainer}>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar} id="my_bars"></div>
                        </div>
                        {projects.length > 0 &&
                            projects.map((data, idx) => (
                                <div className={styles.timelineItem}>
                                    <div className={styles.timelineContent}>
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
                                        <div className={styles.timelineBox}>
                                            <time>
                                                {data.monthstart}
                                                <br></br>
                                                {data.yearstart}
                                            </time>

                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div> */}
                    <div className={styles.projectList} onChange={updateWindowDimensions}>
                        {projects.length > 0 &&
                            projects.map((data, idx) => (
                                <div className={styles.tiltCard} >
                                    <div className={styles.project} id={`${data.title.replaceAll(' ', '-')}`}>
                                        {console.log(`project-${data.title.replaceAll(' ', '-')}`)}
                                        {data.category.map((item) => {
                                            return (
                                                <span
                                                    className={styles.tags}
                                                    style={{ background: item.color }}
                                                >
                                                    {item.tag}
                                                </span>
                                            );
                                        })}
                                        <h2>
                                            {data.title}
                                            {data.link && (
                                                <a
                                                    href={data.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.linkData}
                                                >
                                                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                                                </a>
                                            )}
                                        </h2>

                                        <hr style={{ borderColor: "#2aa6cf" }} />


                                        <h3>{data.subtitle}</h3>
                                        {data.image && (
                                            <img
                                                src={data.image}
                                                alt=""
                                                onLoad={resizeFunction}
                                            />
                                        )}
                                        <time>
                                            {data.date} - {data.enddate}
                                        </time>
                                        <p>{data.description}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
