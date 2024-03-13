// redux react-redux redux-thunk redux-devtools-extension
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Corrected the import for redux-thunk
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import {
    preLoaderReducer,
    userReducer,
    profileReducer
} from './reducers';

const rootReducer = combineReducers({
    preLoader: preLoaderReducer,
    user: userReducer,
    profile: profileReducer
});

const store = createStore(
    rootReducer,
    // Applied the correct thunk middleware
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;
