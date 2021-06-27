import styles from './Photos.module.css';
import ToggleSwitch from '../../resume/LiquidSwitch/ToggleSwitch';
import { useSelector } from 'react-redux';
import { selectPhotoArray } from './photoSlice';
import { useState } from 'react';

export function Photos({ updateFatherDimensions }) {
    const [photoToggle, setPhotoToggle] = useState(false);

    const onPhotoChange = (checked) => {
        setPhotoToggle(checked);
    }

    const photos = useSelector(selectPhotoArray)[photoToggle ? 'tom' : 'dan'];

    return (
        <div className={styles.collageParent} >
            <ToggleSwitch
                id={`photoToggle`}
                checked={photoToggle}
                onChange={onPhotoChange}
                optionLabels={['Tom', 'Dan']}
            />
            <label htmlFor="photoToggle" style={{ visibility: 'hidden' }}>Toggle 'tween photo collages</label>
            <div className={styles.photos} >
                {photos.length > 0 && photos.map((photo) => (
                    <div className={styles.hoverBox} >
                        <img src={photo.image} alt="" onLoad={updateFatherDimensions} className={styles.hoverBoxBottom} />
                        <div className={styles.hoverBoxTop} >
                            <div className={styles.hoverBoxText} >{photo.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}