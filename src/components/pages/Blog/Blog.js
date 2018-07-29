import React, {Component} from 'react';
import Blogpost from './Blogpost/Blogpost';
import styles from './Blog.scss';

class Blog extends Component {
    render() {
        return(
            <div className="d-flex justify-content-center">
                <p className={styles.para}>Typing...</p>
            </div>
        )
    }
}

export default Blog;