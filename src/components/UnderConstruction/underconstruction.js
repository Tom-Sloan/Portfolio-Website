import styles from "./underconstruction.module.scss";
import { Footer } from "../FooterBar/footerBar";
export function UnderConstruction() {
  return (
    <div className={styles.UnderConstruction}>
      <div className={`${styles.parent} ${styles.dividerAttachmentTop}`}>
        <div className={styles.container}>
          <h1>Sorry, we're working on this page</h1>
          <h2>Come back soon and see if it has been finished</h2>
        </div>
      </div>
      <Footer />
    </div>
  );
}
