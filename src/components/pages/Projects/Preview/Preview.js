import React, {Component} from 'react'
import {Container, Row, Col, Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import styles from './Preview.scss';

class Preview extends Component {
    render() {
        return(
            <Container>
                <Row>
                    <Col>
                        <h1>{this.props.title}</h1>
                        <p lead>{this.props.preview}</p>
                        <Button color="primary">
                            <Link to={`/projects/${this.props.projectId}`} className={styles["button-link"]}>Read More</Link>
                        </Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Preview;