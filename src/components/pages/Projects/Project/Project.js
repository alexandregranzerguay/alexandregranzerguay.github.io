import React, {Component} from 'react'
import {Redirect} from 'react-router';
import projectList from './../projectList.json'
import ProjectStyle from './ProjectStyle';

class Project extends Component {
    render() {
        const { match: { params } } = this.props;
        try {
            const title = projectList[params.projectId].title
        } catch(error) {
            return(
                <Redirect to='/404'/>
            )
        }
        return(
            <ProjectStyle 
                title={projectList[params.projectId].title}
                description={projectList[params.projectId].description}
            />
        )
    }
}

export default Project;