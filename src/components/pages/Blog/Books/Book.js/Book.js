import React, {Component} from 'react';
import {Container, Row, Col} from 'reactstrap';

class Book extends Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>book.id.title</h1>
                        <p lead>book.id.thoughts</p>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Book;