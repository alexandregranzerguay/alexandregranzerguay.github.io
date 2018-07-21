import React, {Component} from "react";
import {Container} from 'reactstrap';
import styles from './About.scss';
class About extends Component {
    render() {
        return (
            <Container className={styles["content-container"]}>
                <div className ="d-flex justify-content-center">
                    <h2>Alexandre Granzer-Guay</h2>
                </div>
                <div className ="d-flex justify-content-center">
                    <p>A curious mind with too little time to know it all. Currently finishing my final year of Electrical Engineering at Queen's University. Actively working on personal and open-source projects.</p>
                </div>
            </Container>
        )
    }
}

export default About;