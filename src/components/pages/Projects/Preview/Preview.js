import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'

class Preview extends Component {
    render() {
        return(
            <Container>
                <Row>
                    <Col>
                        <h1>Here is preview for project [Make this modulare based on some project ID]</h1>
                        <p lead> [prop.description]</p>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Preview;