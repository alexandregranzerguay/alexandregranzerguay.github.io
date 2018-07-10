import React from 'react';
import ReactDOM, { hydrate } from 'react-dom';
import './scss/index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import store, { history } from './store';
import { Route, Switch } from 'react-router' // react-router v4
import { ConnectedRouter } from 'connected-react-router'

 ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
            <Switch>
                <Route exact path="/" render={() => (<App />)} />
                <Route render={() => (<div>Error with routing</div>)} />
            </Switch>
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
