
import styles from './Resume.module.css'
import {Footer} from '../../components/FooterBar/footerBar'
import {Resume} from './Resume'

export function ResumeContainer() {
    return(
        <div className={styles.parent}>
            <Resume />
            <Footer />
          </div>
    )
}