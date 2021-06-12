import styles from './Projects.module.css';
import {
    useSelector
} from 'react-redux'
import { selectProjectsArray } from './projectsSlice';

export function Projects() {
    const projects = useSelector(selectProjectsArray);
    console.log(projects);

    const handleHover = (e) => {
        console.log("Hover");
    }

    return ( //https://www.freecodecamp.org/news/how-to-create-a-timeline-component-with-react-1b216f23d3d4/
        <div className={styles.projectContainer}>
            <h1>Projects</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies, ex eu vestibulum consequat, lorem mauris viverra sem, eget maximus urna ipsum ac ipsum. Suspendisse potenti. Donec velit est, tristique at consequat sed, egestas eget turpis. Cras vel fringilla mi, bibendum rhoncus mi. Nam ultricies aliquam finibus. Quisque placerat leo id dui fermentum, at ornare nibh feugiat. Vestibulum fringilla fringilla sem, ac finibus nunc tincidunt non. Donec massa velit, viverra quis aliquam nec, ultricies ut tellus. Vivamus fringilla sagittis suscipit. Donec quis mattis enim, fermentum placerat orci.</p>
            <div className={styles.timelineContainer}>
                {projects.length > 0 && (
                    projects.map((data, idx) => (
                        <div className={styles.timelineItem}>
                            <div className={styles.timelineContent}>
                                <div className={styles.timelineBox} >
                                    <span className={styles.timelineTag} style={{ background: data.category.color }}>
                                        {data.category.tag}
                                    </span>
                                    <time>{data.date}</time>
                                    <p>{data.text}</p>
                                    {data.link && (
                                        <a
                                            href={data.link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {data.link.text}s
                                        </a>
                                    )}
                                </div>
                                <span className={styles.timelineCircle}  />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}