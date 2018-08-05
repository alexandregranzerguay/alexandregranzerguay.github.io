import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'reactstrap';
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
            <div>
                
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
                <a href="https://www.instagram.com/alexandregranzerguay/" className={styles.icon}>
                    <FontAwesomeIcon icon={['fab', 'instagram']} size='4x' className={styles.insta} />          
                </a>     
                </div>
                <Container>
                    <div className="d-flex justify-content-center" style={{paddingBottom: '1%'}}>
                    <h4 className={styles.email}>
                    <a href="mailto:alexandre.granzerguay@gmail.com" target="_top">alexandre.granzerguay@gmail.com</a>  
                    </h4>
                
                    </div>
                </Container>
            </div>
        )
    }
}

export default Footer;