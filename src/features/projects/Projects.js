import styles from "./Projects.module.css";
import bodyStyle from "../../components/BodyStyles.module.css";
import footerStyle from "../../components/FooterBar/FooterStyles.module.css";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import { selectProjectsArray } from "./projectsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

export function Projects() {
    const projects = useSelector(selectProjectsArray);
    // console.log(projects);

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

        // document.document.querySelector(`.${styles.page}`).style.height
        // console.log(getComputedStyle(document.querySelector(`.${styles.projectList}`)).height);
        // console.log(getComputedStyle(document.querySelector(`.${styles.page}`)).height)
        // console.log(document.querySelector(`.${styles.projectList}`).children);
        // console.log(document.querySelector(`.${styles.projectList}`).children)
    };

    useEffect(() => {
        const updateTimeline = () => {
            try {
                Array.from(
                    document.querySelector(`.${styles.projectList}`).children
                ).forEach((elem) => {
                    // console.log(elem);
                    // console.log(isScrolledIntoView(elem));
                    // console.log(elem);
                    if (isScrolledIntoView(elem)) {
                        // console.log(elem.children[0]);
                        if (document.getElementById(`circle ${elem.id}`)) {
                            document.getElementById(
                                `circle ${elem.id}`
                            ).style.backgroundColor = "#00dae6";
                            // return true;
                            // console.log('hello');
                        }
                    } else {
                        if (document.getElementById(`circle ${elem.id}`)) {
                            document.getElementById(
                                `circle ${elem.id}`
                            ).style.backgroundColor = '#00adb5' /*"#2fc1f2"*/;
                        }
                    }
                });

                var winScroll = document.querySelector(`.${bodyStyle.parallaxParent}`).scrollTop;
                var height = document.querySelector(`.${styles.page}`).offsetHeight - document.querySelector(`.${bodyStyle.parallaxParent}`).offsetHeight + document.querySelector(`.${footerStyle.footer}`).offsetHeight;
                var scrolled = (winScroll / height) * 100;
                document.getElementById('my_bars').style.height = scrolled + "%";

                // console.log(winScroll);
                // console.log(height);
                // console.log(scrolled);
            } catch (e) {
                console.log(e);
            }
        };

        console.log(document.querySelector(`.${bodyStyle.parallaxParent}`));

        //THIS

        document
            .querySelector(`.${bodyStyle.parallaxParent}`)
            .addEventListener("scroll", updateTimeline);

        try {
            updateTimeline();
        } catch (e) {
            console.log(e);
        }

        // return () => document.querySelector(`.${bodyStyle.parallaxParent}`).removeEventListener('scroll', updateTimeline);
    }, []);

    function isScrolledIntoView(elem) {
        var docViewTop = document.querySelector(
            `.${bodyStyle.parallaxParent}`
        ).scrollTop;
        var docViewBottom =
            docViewTop +
            document.querySelector(`.${bodyStyle.parallaxParent}`).offsetHeight;

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

    const handleHover = (e) => {
        e.target.style.backgroundColor = "#00dae6";
    };

    const handleNoHover = (e) => {
        e.target.style.backgroundColor = "#00adb5";
    };

    // useEffect(() => {
    //     window.addEventListener("resize", updateWindowDimensions);
    //     updateWindowDimensions();

    //     return () => window.removeEventListener("resize", updateWindowDimensions);
    // }, []);

    useEffect(() => {
        window.addEventListener("resize", updateWindowDimensions);

        try {
            updateWindowDimensions();
        } catch (e) {
            console.log(e);
        }

        // console.log(document.querySelector(`.${styles.projectList}`).children[3]);

        return () => window.removeEventListener("resize", updateWindowDimensions);
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
            {/* <div className={styles.parallax} ></div> */}
            <div className={styles.projectContainer}>
                <div className={styles.projects}>
                    {/* <h1>Projects</h1>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                        ultricies, ex eu vestibulum consequat, lorem mauris viverra sem,
                        eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit
                        est, tristique at consequat sed, egestas eget turpis. Cras vel
                        fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus.
                        Quisque placerat leo id dui fermentum, at ornare nibh feugiat.
                        Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non.
                        Donec massa velit, viverra quis aliquam nec, ultricies ut tellus.
                        Vivamus fringilla sagittis suscipit. Donec quis mattis enim,
                        fermentum placerat orci.
                    </p> */}
                    <div className={styles.timelineContainer}>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar} id='my_bars' ></div>
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
                                            <time>{data.monthstart}<br></br>{data.yearstart}</time>
                                            {/* <div className={styles.timelineHalf} style={{ justifyContent: 'flex-end' }} >
                                            {data.category.map(obj => {
                                                console.log(obj);
                                                return (
                                                    <span className={styles.timelineTag} style={{ background: obj.color }}>
                                                        {obj.tag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        <div className={styles.timelineHalf} style={{ justifyContent: 'flex-start' }} >
                                            <time>{data.date}</time>
                                            <p>{data.text}</p>
                                            {data.link && (
                                                <a
                                                    href={data.link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {data.link.text}
                                                </a>
                                            )}
                                        </div> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {/* <div className={styles.timelineItem}>
                            <div className={styles.timelineContent}>
                                <a
                                    href={`#footer`}
                                    className={styles.circleLink}
                                    onMouseEnter={handleHover}
                                    onMouseLeave={handleNoHover}
                                >
                                    <span
                                        className={styles.timelineCircle}
                                        id={`circle data ${projects.length}`}
                                    />
                                </a>
                                <div className={styles.timelineBox}>
                                    <time>Footer<br></br>End</time>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className={styles.projectList} onChange={updateWindowDimensions}>
                        {projects.length > 0 &&
                            projects.map((data, idx) => (
                                // <div className={styles.stickyContainer} >
                                    <div className={styles.project} id={`data ${idx}`}>
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

                                        <h3>{data.subtitle}</h3>
                                        {data.image && (
                                            <img
                                                src={data.image}
                                                alt=""
                                                onLoad={updateWindowDimensions}
                                            />
                                        )}
                                        <time>
                                            {data.monthstart} {data.yearstart} - {data.monthend} {data.yearend}
                                        </time>
                                        <p>{data.description}</p>
                                    </div>
                                // </div>
                            ))}
                    </div>



                </div>
            </div>
        </div>
    );
}
