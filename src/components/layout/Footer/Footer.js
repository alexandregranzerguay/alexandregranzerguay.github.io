import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons'

// Need this for brand icons
library.add(fab)

class Footer extends Component {
    render() {
        return (
            <div>
                <a href="https://github.com/alexandregranzerguay">
                    <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
                <a href="https://www.linkedin.com/in/alexandre-granzer-guay-8b8378b2/">
                    <FontAwesomeIcon icon={['fab', 'linkedin-in']} />                
                </a>
                <a href="https://www.facebook.com/alexandre.guay3">
                    <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                </a>
                <a href="https://www.instagram.com/alexandregranzerguay/">
                    <FontAwesomeIcon icon={['fab', 'instagram']} />          
                </a>
            </div>
        )
    }
}

export default Footer;