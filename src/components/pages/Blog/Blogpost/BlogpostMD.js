import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'

// const test = myFirstContribution
const input = '# This is a header\n\nAnd this is a paragraph'

class BlogpostMD extends Component {
    constructor(props) {
        super(props)
        this.state = {content : null}
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
        // console.log(text);
    });
    }
    componentDidMount(props){
        const markdownFile = require('./MarkdownPosts/'+this.props.id+'.md');
        console.log(markdownFile)
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