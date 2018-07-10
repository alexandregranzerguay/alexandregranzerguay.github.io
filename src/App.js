import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Featured from './container/featured.js';
import About from './container/about.js';
import Contact from './container/contact.js';
import Projects from './container/projects.js';
import styles from './App.scss';

class App extends Component {
  render() {
        return (
          <div className={styles.App}>
         <Link to="/"><p>Featured</p></Link>
         <Link to="/about"><p>About</p></Link>
         <Link to="/contact"><p>Contact</p></Link>
         <Link to="/projects"><p>Projects</p></Link>
         <Route exact path="/" component={Featured}/>
         <Route exact path="/about" component={About}/>
         <Route exact path="/contact" component={Contact}/>
         <Route exact path="/projects" component={Projects}/>
         </div>
        );
  }
}

export default App;
