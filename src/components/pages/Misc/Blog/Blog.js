import React, {Component} from 'react';
import Blogpost from './Blogpost/Blogpost';

class Blog extends Component {
    render() {
        return(
            <div>
                <Blogpost/>
                <Blogpost/>
                <Blogpost/>
            </div>
        )
    }
}

export default Blog;