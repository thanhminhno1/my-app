// @flow
const keyMirror = (list) => {
  let newList= {};
  Object.keys(list).map(element => {
    var key = String(element);
    newList[key] = element
  });
  return newList
}

export const ActionTypes = keyMirror({
  USER_LOGIN: undefined,
  USER_LOGOUT: undefined,
});

export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'error',
  OK: 'ok',
};

export const EMAIL_REGEX =  /^([\w.%+-]+)@([\w.-]+\.+[\w]{2,})$/;
