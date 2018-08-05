import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'

class BlogpostMD extends Component {
    constructor(props) {
        super(props)
        this.state = {content : null, url : null}
    }

    loadBlog = blogId => {
        fetch(blogId)
        .then(response => response.text())
        .then(text => {
        // Logs a string of Markdown content.
        // Now you could use e.g. <rexxars/react-markdown> to render it.
        console.log('prop', blogId)
        this.setState(()=>{
            return {content : text}
        })
    });
    }
    componentDidMount(props){
        const markdownFile = require('./MarkdownPosts/'+this.props.id+'.md');
        console.log('is this an object',markdownFile)
        this.loadBlog(markdownFile)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id) {
          this.loadData(nextProps.id);
        }
    }

    render () {
        return(
                <ReactMarkdown 
                    source={this.state.content}
                />
        )
    }
}

export default BlogpostMD