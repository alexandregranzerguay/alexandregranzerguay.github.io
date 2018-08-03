import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home/Home';
import About from './components/pages/About/About';
import Projects from './components/pages/Projects/Projects';
import Project from './components/pages/Projects/Project/Project';
import Blog from './components/pages/Blog/Blog';
import noMatch from './components/pages/noMatch/noMatch';
import projectList from './components/pages/Projects/projectList.json';
import ServeBlogpost from './components/pages/Blog/Blogpost/ServeBlogpost';

const routes = (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/about" component={About} />
        <Route exact path="/projects" component={Projects} />
        <Route exact path="/projects/:projectId" component={Project} />
        <Route exact path="/blog" component={Blog} />
        <Route exact path="/blog/:id" component={ServeBlogpost} />
        <Route exact path="/404" component={noMatch}/>
        <Route component={noMatch} />
    </Switch>
);

export default routes;