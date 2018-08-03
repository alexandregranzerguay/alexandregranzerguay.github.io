import React, {Component} from 'react';
import {Container} from 'reactstrap';
import Book from './Book/Book';
import styles from './Books.scss'

class Books extends Component {
    render() {
        return(
            <Container>
                <div className="d-flex justify-content-center">
                    <p className={styles.para}>Coming Soon...</p>
                </div>
            </Container>
        )
    }
}

export default Books;