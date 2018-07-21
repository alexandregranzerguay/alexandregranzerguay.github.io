import React, {Component} from 'react';
import {Container} from 'reactstrap';
import styles from './noMatch.scss';

class noMatch extends Component {
    render() {
        return (
            <Container className={styles["content-container"]}>
                <div className ="d-flex justify-content-center">
                    <h1> 404 </h1>
                </div>
                <div className ="d-flex justify-content-center">
                    <p lead> Oops! Seems like the page you are trying to access does not exist.</p>
                </div>
            </Container>
        )
    }
}

export default noMatch;