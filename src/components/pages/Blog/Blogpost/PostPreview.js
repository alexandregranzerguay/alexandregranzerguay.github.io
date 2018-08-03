import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row } from 'reactstrap';
import styles from './PostPreview.scss'


class PostPreview extends Component {
    render() {
        return (
            <div>
                <div className="d-flex justify-content-left flex-wrap">
                    <h2>{this.props.title}</h2>
                    <p>{this.props.preview}</p>
                </div>
                <div className="d-flex justify-content-left flex-wrap">
                    <Link to={{ 
                        pathname:`/blog/${this.props.id}`, 
                        state:{ isMarkdown: true}
                        }}
                        className={styles["button-link"]}>
                        <Button color="primary">
                            Read More
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default PostPreview;