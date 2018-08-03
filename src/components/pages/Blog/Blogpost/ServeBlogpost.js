import React, {Component} from 'react'
import {Container} from 'reactstrap';
import Blogpost from './Blogpost';
import BlogpostMD from './BlogpostMD';
import {Redirect} from 'react-router';

class ServeBlogpost extends Component {
    render() {
        var isMarkdown = null
        try {
            isMarkdown = this.props.location.state.isMarkdown
        } catch(error) {
            return(
                <Redirect to='/404'/>
            )
        }
        const { match: { params } } = this.props;
        console.log(params)
        console.log(isMarkdown)
        if(isMarkdown){
            return (
                <Container style={{paddingTop:'5%'}}>
                    <BlogpostMD 
                        id={params.id}
                    />
                </Container>
            )
        }      
    }
}

export default ServeBlogpost;