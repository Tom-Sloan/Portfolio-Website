import styles from './Projects.module.css';
import {
    useSelector
} from 'react-redux'
import { selectProjectsArray } from './projectsSlice';

export function Projects() {
    const projects = useSelector(selectProjectsArray);
    console.log(projects);

    return ( //https://www.freecodecamp.org/news/how-to-create-a-timeline-component-with-react-1b216f23d3d4/
        <div className={styles.timelineContainer}>
            {projects.length > 0 && (
                projects.map((data, idx) => (
                    <div className={styles.timelineItem}>
                        <div className={styles.timelineContent}>
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
                                    {data.link.text}
                                </a>
                            )}
                            <span className={styles.timelineCircle} />
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}