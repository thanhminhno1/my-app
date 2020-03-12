import { all, delay, put, takeLatest } from 'redux-saga/effects';

import { ActionTypes } from '../constants';

export function* login(action) {
  try {
    const { values, meta: { setSubmitting }} = action.payload;

    
    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
      payload: err,
    });
  }
}

export function* logout() {
  try {
    yield delay(200);

    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.USER_LOGIN, login),
  ]);
}
