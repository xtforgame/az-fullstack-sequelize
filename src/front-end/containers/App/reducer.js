import { combineReducers } from 'redux'
import modelMap from './modelMap';

const {
  SESSION_READ_COLL_SUCCESS,
  SESSION_READ_COLL_ERROR,
} = modelMap.types;

const {
  sessionReducer,
} = modelMap.reducers;

export default combineReducers({
  sessions: sessionReducer,
});
