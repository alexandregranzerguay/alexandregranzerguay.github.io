import React, {Component} from 'react';
import Book from './Book/Book';

class Books extends Component {
    render() {
        return(
            <div>
                <Book/>
                <Book/>
                <Book/>
            </div>
        )
    }
}

export default Books;