import React, {Component} from 'react'
import {Container, Row, Col, Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import styles from './Preview.scss';

class Preview extends Component {
    render() {
        return(
            <Container className={styles["content-container"]}>
                <Row>
                    <Col>
                        <h2>{this.props.title}</h2>
                        <p lead>{this.props.preview}</p>
                        <Link to={`/projects/${this.props.projectId}`} className={styles["button-link"]}>
                            <Button color="primary">
                                Read More
                            </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Preview;