import styles from "./Photos.module.css";
import { useSelector } from "react-redux";
import { selectPhotoArray } from "./photoSlice";
import { useContext } from "react";
import { NameContext } from "../../../AllContexts";

export function Photos({ updateFatherDimensions }) {
  const personName = useContext(NameContext).personName;
  const photos = useSelector(selectPhotoArray)[personName];

  return (
    <div className={styles.collageParent}>
      <div className={styles.photos}>
        {photos.length > 0 &&
          photos.map((photo) => (
            <div className={styles.hoverBox}>
              <img
                src={photo.image}
                alt=""
                onLoad={updateFatherDimensions}
                className={styles.hoverBoxBottom}
              />
              <div className={styles.hoverBoxTop}>
                <div className={styles.hoverBoxText}>{photo.description}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
