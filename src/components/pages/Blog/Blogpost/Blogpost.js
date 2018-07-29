import React, {Component} from 'react';
import {Container, Col, Row} from 'reactstrap';

class Blogpost extends Component {
    render() {
        return(
            <Container>
                <Row>
                    <Col>
                        <h1>blogpost.id.title</h1>
                        <p lead>blogpost.id.thoughts</p>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Blogpost;