import { createActions } from 'redux-action';

import { ActionTypes } from '../constants';

export const { userLogin: login, userLogout: logout } = createActions({
  [ActionTypes.USER_LOGIN]: payload => payload,
  [ActionTypes.USER_LOGOUT]: () => ({}),
})