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
                    <p className={styles.para}>Currently finishing my final year of Electrical Engineering at Queen's University.
                        Actively working on personal and open-source projects. Currently looking for full-time
                        full-stack software developer positions in AI, Machine Learning, or Financial Services sector.
                    </p>
                </div>
                <div className ="d-flex justify-content-center">
                    <p className={styles.para}>I am currently working at the Wigner Research Institute as an Embedded Systems
                        Developer Intern. The Institute is working with the Europeen Space Agency JUpiter Icy Moons Explorer (JUICE). During my time in Budapest, I have
                        been working on communication control between two embedded systems. My work has been 
                        completed using VHDL for building logic and Quartus for simulation purposes.
                    </p>
                </div>
                <div className ="d-flex justify-content-center">
                    <p className={styles.para}> Previously worked at the Centre for Advanced Computing. I was in a team of 4 full-stack 
                        software developers. We developed web applications using various tools but mostly focused
                        on React/Redux with NodeJS backend. The products developed noticeably helped the client’s 
                        current reach and growth in a new market. 
                    </p>
                </div>
            </Container>
        )
    }
}

export default About;