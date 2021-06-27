import { useSelector } from 'react-redux';
import projectsSlice from '../projects/projectsSlice';
import styles from './General.module.css';
import { selectGeneralArray, selectPersonalsArray, selectSportsArray } from './generalSlice';
import ToggleSwitch from '../resume/LiquidSwitch/ToggleSwitch';
import { useState } from 'react';

export function General({ choice, updateFatherDimensions }) {
    const [generalToggle, setGeneralToggle] = useState(false);

    const onGeneralChange = (checked) => {
        setGeneralToggle(checked);
    }

    const items = useSelector(selectGeneralArray)[choice][generalToggle ? 'tom' : 'dan'];
    // const personals = useSelector(selectPersonalsArray)[human];
    // let items;

    // console.log(sports)

    // if (choice === "sports") {
    //     items = sports;
    // } else if (choice === "personals") {
    //     items = personals;
    // }

    console.log(items)

    return (
        <div className={styles.general} >
            <ToggleSwitch
                id={`generalToggle ${choice}`}
                checked={generalToggle}
                onChange={onGeneralChange}
                optionLabels={['Tom', 'Dan']}
            />
            <label htmlFor="generalToggle" style={{ visibility: 'hidden' }}>Toggle 'tween general items</label>
            {items.length > 0 && items.map((item) => (
                <div className={styles.generalItem}>
                    <img src={item.image} alt="" onLoad={updateFatherDimensions} />
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                </div>
            ))}
        </div>
    )
}