import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
// import About from './container/about/about';
// import Contact from './container/contact/contact';
// import Projects from './container/projects/projects';
import styles from './App.scss';

class App extends Component {
  render() {
        return (
          <div className={styles.App}>
         <Link to="/"><p>Home</p></Link>
         <Link to="/about"><p>About</p></Link>
         <Link to="/contact"><p>Contact</p></Link>
         <Link to="/projects"><p>Projects</p></Link>
         {/* <Route exact path="/about" component={About}/> */}
         {/* <Route exact path="/contact" component={Contact}/>
         <Route exact path="/projects" component={Projects}/> */}
         </div>
        );
  }
}

export default App;
