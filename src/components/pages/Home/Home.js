import React, { Component } from 'react';
import {Jumbotron, Button, Container, Col, Row} from 'reactstrap';
import image from './Profile_Photo.jpg';
import styles from './Home.scss';

class Home extends Component {
    render() {
        return (
            <Jumbotron fluid>
                <Container>
                    <Row>
                        <Col>
                            <h1>Hello, my name is <p>Alexandre Granzer-Guay</p></h1>
                            <p className="h4">Explore. Live. Create.</p>
                            <hr className="my-2" />
                            <p className="lead">Here I will share with you life experiences, hard-learned lessons, and basically my way of optimising life.</p>
                            <p className="lead">
                                <Button color="primary">Stalk Me!</Button>
                            </p>
                        </Col>
                        <Col>
                            <img 
                            src={image} 
                            alt="profile_photo"
                            />
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
        )
    }
}

export default Home;