import React, {Component} from 'react'
import {Container} from 'reactstrap';
import styles from './ProjectStyle.scss';
class ProjectStyle extends Component {
    render() {
        return(
        <Container className={styles["content-container"]}>
            <div className="d-flex justify-content-center">
                <h2>{this.props.title}</h2>
            </div>
            <div className="d-flex justify-content-center">
                <p>{this.props.description}</p>
            </div>
        </Container>
        )
    }
}

export default ProjectStyle;