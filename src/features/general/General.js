import { useSelector } from 'react-redux';
import styles from './General.module.css';
import { selectGeneralArray } from './generalSlice';
import { useContext } from 'react';
import { NameContext } from '../../AllContexts';

export function General({ choice, updateFatherDimensions }) {

    const personName = useContext(NameContext).personName;

    const items = useSelector(selectGeneralArray)[choice][personName];

    return (
        <div className={styles.general} >
            
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