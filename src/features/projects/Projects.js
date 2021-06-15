import styles from './Projects.module.css';
import bodyStyle from '../../components/headerStyles.module.css';
import {
    useSelector,
} from 'react-redux';
import { useEffect } from 'react';
import { selectProjectsArray } from './projectsSlice';

export function Projects() {
    const projects = useSelector(selectProjectsArray);
    // console.log(projects);

    useEffect(() => {
        document.querySelector(`.${styles.parallax}`).style.height = getComputedStyle(document.querySelector(`.${styles.projectList}`)).height;
        document.querySelector(`.${styles.parallax}`).style.width = getComputedStyle(document.querySelector(`.${bodyStyle.bodyArea}`)).width;
        // document.querySelector(`.${styles.project} img`).style.height = getComputedStyle(document.querySelector(`.${bodyStyle.bodyArea}`)).width;

        const updateWindowDimensions = () => {
            document.querySelector(`.${styles.parallax}`).style.height = getComputedStyle(document.querySelector(`.${styles.projectList}`)).height;
            document.querySelector(`.${styles.parallax}`).style.width = getComputedStyle(document.querySelector(`.${bodyStyle.bodyArea}`)).width;
        };

        window.addEventListener("resize", updateWindowDimensions);
        updateWindowDimensions();

        // console.log(document.querySelector(`.${styles.projectList}`).children[3]);

        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, [])

    function isScrolledIntoView(elem) {
        var docViewTop = document.querySelector(`.${bodyStyle.bodyArea}`).scrollTop;
        var docViewBottom = docViewTop + getComputedStyle(document.querySelector(`.${styles.projectList}`)).height;

        var elemTop = getComputedStyle(elem).offset;
        var elemBottom = elemTop + getComputedStyle(elem).height;

        console.log(elem);
        console.log(docViewTop);
        console.log(docViewBottom);
        console.log(elemTop);
        console.log(elemBottom);

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    const handleScroll = (e) => {
        console.log(isScrolledIntoView(document.querySelector(`.${styles.projectList}`).children[3]));
    }

    return ( //https://www.freecodecamp.org/news/how-to-create-a-timeline-component-with-react-1b216f23d3d4/
        <div className={styles.page} onScroll={handleScroll} >
            <div className={styles.parallax} ></div>
            <div className={styles.projectContainer}>

                <div className={styles.projects} >
                    <div className={styles.timelineContainer}>
                        {projects.length > 0 && (
                            projects.map((data, idx) => (
                                <div className={styles.timelineItem}>
                                    <div className={styles.timelineContent}>
                                        <a href={`#data ${idx}`}>
                                            <span className={styles.timelineCircle} />
                                            <div className={styles.timelineBox} >
                                                <time>{data.date}</time>
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
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className={styles.projectList} >
                        <h1>Projects</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.</p>
                        {projects.length > 0 && (
                            projects.map((data, idx) => (
                                <div className={styles.project} id={`data ${idx}`} >

                                    <h2>{data.title}</h2>
                                    <hr style={{ borderColor: '#2aa6cf' }} />
                                    {data.category.map(item => {
                                        return (
                                            <span className={styles.tags} style={{ background: item.color }}>
                                                {item.tag}
                                            </span>
                                        )
                                    })}

                                    <h3>{data.subtitle}</h3>
                                    {data.image && <img src={data.image} alt="" />}
                                    <time>{data.date} - {data.enddate}</time>
                                    <p>{data.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}