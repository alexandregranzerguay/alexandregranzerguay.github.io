import React, { Component } from 'react';
import {Jumbotron, Button, Container, Col, Row} from 'reactstrap';
import { Link } from 'react-router-dom'
import image from './Profile_Photo.jpg';
import styles from './Home.scss';

class Home extends Component {
    render() {
        return (
            <Jumbotron fluid className={styles["content-container"]}>
                <Container>
                    <Row>
                        <Col>
                            <h1>Hello, my name is </h1>
                            <h1>Alexandre Granzer-Guay</h1>
                            <h4>Explore. Live. Create.</h4>
                            <hr className="my-2" />
                            <p className="lead">Here I will share with you life experiences, hard-learned lessons, and basically my way of optimising life.</p>
                            <p className="lead">
                            <Link to="/about" className={styles["button-link"]}>
                                <Button color="primary">
                                    About Me
                                </Button>
                            </Link>
                            </p>
                        </Col>
                        <Col>
                            <img 
                            className={styles.homeImg}
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