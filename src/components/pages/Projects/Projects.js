import React, { Component } from 'react'
import Preview from './Preview/Preview'
import projectList from './projectList.json';

class Projects extends Component {
    render() {
        return (
        <div>
            <Preview title={projectList[0].title} preview={projectList[0].preview} projectId="0"/>
        </div>
        )
    }
}

export default Projects