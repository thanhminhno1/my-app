import { combineReducers } from 'redux';

import user from './user';

const createReducer = asyncReducers =>
  combineReducers({
    // TODO inject reducer
    ...user,
    ...asyncReducers,
  });

export default createReducer;
