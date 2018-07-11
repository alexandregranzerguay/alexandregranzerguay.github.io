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
                {/* <a href="https://github.com/alexandregranzerguay">
                    <i class="fab fa-github fa-3x" style="margin-right:0.3em;"></i>
                </a> */}
                {/* <Link to="https://www.facebook.com/alexandre.guay3">
                
                <i className="fab fa-facebook-f fa-3x"></i>
                </Link> */}
                <FontAwesomeIcon icon={['fab', 'github']} />
                <FontAwesomeIcon icon={['fab', 'linkedin-in']} />
                <FontAwesomeIcon icon={['fab', 'facebook-f']} />
                <FontAwesomeIcon icon={['fab', 'instagram']} />
                {/* <a href="">
                    
                </a>
                <a href="https://www.linkedin.com/in/alexandre-granzer-guay-8b8378b2/">
                    <i class="fab fa-linkedin-in fa-3x" style="margin-right:0.3em;"></i>
                </a>
                <a href="https://www.instagram.com/alexandregranzerguay/">
                    <i class="fab fa-instagram fa-3x"></i>
                </a> */}
            </div>
        )
    }
}

export default Footer;