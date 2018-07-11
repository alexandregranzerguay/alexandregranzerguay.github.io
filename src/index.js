import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'
import store, { history } from './store';

ReactDOM.render(
    <Provider store={store} >
        <BrowserRouter history={history} >
                <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
