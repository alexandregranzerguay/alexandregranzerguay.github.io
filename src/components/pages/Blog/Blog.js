import React, {Component} from 'react';
import { Container, Row } from 'reactstrap';
import PostPreview from './Blogpost/PostPreview';
import styles from './Blog.scss';

class Blog extends Component {
    render() {
        return(
        <Container>
            <div className="d-flex justify-content-center">
                <p className={styles.para}>Typing...</p>
            </div>
            <div>
                <PostPreview 
                    title={"My First Contribution"}
                    preview={"The day I made my first contribution to the open-source community, what it meant, what I did, and what I learnt from it."}
                    id={"my-first-contribution"}
                />
            </div>
        </Container>
        )
    }
}

export default Blog;