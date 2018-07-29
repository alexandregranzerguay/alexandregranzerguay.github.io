import React, { Component } from 'react'
import Preview from './Preview/Preview'
import projectList from './projectList.json';
import styles from './Projects.scss';

class Projects extends Component {
    render() {
        return (
        <div>
            <div className="d-flex justify-content-center">
                <p className={styles.para}>More projects are in the works and will be posted soon...</p>
            </div>
            <div>
                <Preview title={projectList[0].title} preview={projectList[0].preview} projectId="0"/>
            </div>
        </div>
        )
    }
}

export default Projects