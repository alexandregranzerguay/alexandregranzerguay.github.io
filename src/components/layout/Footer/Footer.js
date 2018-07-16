import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'
import styles from './Footer.scss';

// Need this for brand icons
library.add(fab)

class Footer extends Component {
    render() {
        return (
                <div className="d-flex justify-content-center" >
                <a href="https://github.com/alexandregranzerguay" className={styles.icon}>
                    <FontAwesomeIcon icon={['fab', 'github']} size='4x' className={styles.git} />
                </a>
                <a href="https://www.linkedin.com/in/alexandre-granzer-guay-8b8378b2/" className={styles.icon}>
                    <FontAwesomeIcon 
                        icon={['fab', 'linkedin-in']} 
                        size='4x'
                        className={styles.linkedin}
                    />                
                </a>
                <a href="https://www.facebook.com/alexandre.guay3" className={styles.icon}>
                    <FontAwesomeIcon icon={['fab', 'facebook-f']} size='4x' className={styles.fb} />
                </a>
                <a href="https://www.instagram.com/alexandregranzerguay/" className={styles.icon}>
                    <FontAwesomeIcon icon={['fab', 'instagram']} size='4x' className={styles.insta} />          
                </a>
                </div>
        )
    }
}

export default Footer;