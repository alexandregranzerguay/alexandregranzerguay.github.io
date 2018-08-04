import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom'
import store, { history } from './store';

ReactDOM.render(
    <Provider store={store} >
        <Router history={history} >
                <App/>
        </Router>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
