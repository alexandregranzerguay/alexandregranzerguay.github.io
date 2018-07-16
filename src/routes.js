import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/pages/Home/Home';
import About from './components/pages/About/About';
import Projects from './components/pages/Projects/Projects';
import Project from './components/pages/Projects/Project/Project';
import noMatch from './components/pages/noMatch/noMatch';
import projectList from './components/pages/Projects/projectList.json';

const routes = (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/about" component={About} />
        <Route exact path="/projects" component={Projects} />
        <Route path="/projects/:projectId" component={Project} />
        <Route component={noMatch} />
        {/* Figure out how this will be possible to do */}
        {/* <Route exact path="/projects/[id]" component={Project.[id]} */}
    </Switch>
);

export default routes;