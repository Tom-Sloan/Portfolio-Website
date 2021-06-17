// import styles from './Resume.module.css';
import { Document, Page } from 'react-pdf';

export function Resume() {
    return (
        <div>
            <Document file='../../../public/Daniel_Neasmith_CV.pdf' >
                <Page />
            </Document>
        </div>
    )
}