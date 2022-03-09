import styles from './LinkedInTile.module.css';
import { selectWorkplacesArray } from './workplaceSlice';
import { useSelector } from "react-redux";

export function LinkedInTile() {
    const workplaces = useSelector(selectWorkplacesArray);

    return (
        <div className={styles.work}>
            <h1>Work Experiences</h1>
            {workplaces.length > 0 &&
                workplaces.map((data, idx) => (
                    <div className={styles.workPlace} >
                        <img src={data.image} alt="" />
                        <h2>{data.name}</h2>
                        <h3>{data.title}</h3>
                        <time>{data.date} - {data.enddate}</time>
                        <ul>
                            {data.tasks.map((task) => (
                                <li>{task}</li>
                            ))}
                        </ul>
                    </div>
                ))
            }
        </div>
    )
}