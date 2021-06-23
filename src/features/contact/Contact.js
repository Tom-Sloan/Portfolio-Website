import styles from './Contact.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';

export function Contact() {
    return (
        <div style={{ height: '80vh', color: 'var(--text)' }} >
            {/* <h2 style={{ textAlign: 'center' }} >Get in Touch</h2>
            <hr /> */}
            <div className={styles.contactParent} >
                <div className={styles.contact} >
                    <FontAwesomeIcon className={styles.icons} icon={faLinkedin} />
                    <h3>LinkedIn</h3>
                    <p><a href='https://www.linkedin.com/in/danielneasmith/' target='_blank'>Daniel Neasmith</a></p>
                    <p><a href='https://www.linkedin.com/in/tomsloan7/' target='_blank'>Tom Sloan</a></p>
                </div>
                <hr />
                <div className={styles.contact} >
                    <FontAwesomeIcon className={styles.icons} icon={faGithubSquare} />
                    <h3>GitHub</h3>
                    <p><a href='https://github.com/DanNeasmith' target='_blank'>Daniel Neasmith</a></p>
                    <p><a href='https://github.com/Tom-Sloan' target='_blank'>Tom Sloan</a></p>
                </div>
                <hr />
                <div className={styles.contact} >
                    <FontAwesomeIcon className={styles.icons} icon={faPaperPlane} />
                    <h3>Or send an email</h3>
                    <p><u><a href='mailto:danneasmith@gmail.com' target='_blank'>Daniel Neasmith</a></u> @ DanNeasmith@gmail.com</p>
                    <p><u><a href='mailto:tsloan81@gmail.com' target='_blank'>Tom Sloan</a></u> @ tsloan81@gmail.com</p>
                </div>
                {/* <form action="mailto:danneasmith@gmail.com" method="post" enctype="text/plain" >
                {FirstName:<input type="text" name="FirstName" />
                Email:<input type="text" name="Email" />}
                <input type="submit" name="submit" value="Submit" />
            </form> */}
            </div>
        </div>
    );
}