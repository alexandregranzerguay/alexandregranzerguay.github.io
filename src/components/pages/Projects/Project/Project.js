import React, {Component} from 'react'
import projectList from './../projectList.json'
import ProjectStyle from './ProjectStyle';

class Project extends Component {
    render() {
        const { match: { params } } = this.props;
        
        return(
            <ProjectStyle 
                title={projectList[params.projectId].title}
                description={projectList[params.projectId].description}
            />
        )
    }
}

export default Project;