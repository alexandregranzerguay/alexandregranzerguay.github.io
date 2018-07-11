import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
// import { createBrowserHistory } from 'history'
import {createBrowserHistory} from 'history'
import { routerMiddleware } from 'react-router-redux'
import reducers from './reducers'
import { connectRouter } from 'connected-react-router';

export const history = createBrowserHistory()

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history)
]

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
    connectRouter(history)(reducers),
    initialState,
    composedEnhancers
)

export default store;

