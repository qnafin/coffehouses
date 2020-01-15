import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
 
import reducers from './reducer/index'; 

// Connect our store to the reducers
export default createStore(reducers, applyMiddleware(thunk.withExtraArgument({ /*pointDao */})));