import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Featured from './container/featured.js';
import About from './container/about.js';
import Contact from './container/contact.js';
import Projects from './container/projects.js';
import logo from './logo.svg';
import styles from './App.scss';

class App extends Component {
  render() {
        return (
          <div className={styles.App}>
            <header className={styles["App-header"]}>
              <img src={logo} className={styles["App-logo"]} alt="logo" />
              <h1 className={styles["App-title"]}>Welcome to React</h1>
            </header>
         <Link to="/"><p>Featured</p></Link>
         <Link to="/about"><p>About</p></Link>
         <Link to="/contact"><p>Contact</p></Link>
         <Link to="/projects"><p>Projects</p></Link>
            <p className={styles["App-intro"]}>
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
         <Route exact path="/" component={Featured}/>
         <Route exact path="/about" component={About}/>
         <Route exact path="/contact" component={Contact}/>
         <Route exact path="/projects" component={Projects}/>
         </div>
        );
  }
}

export default App;
