import { applyMiddleware , legacy_createStore as createStore, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import AmazonReducer from './Reducer/AmazonReducer';
import AuthReducer from './Reducer/AuthReducer';
import LoaderReducer from './Reducer/loaderReducer';
import apiMiddleware from './apiMiddleware';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    data: AmazonReducer,
    auth: AuthReducer,
    loader:LoaderReducer
  });

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, apiMiddleware))
)
export default store;