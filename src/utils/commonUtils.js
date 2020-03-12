// @flow
import {
  transform, isPlainObject, isEmpty, flatten,
  pick, keys as getKeys, isEqual, toString,
  isNumber, compact, mapValues,
} from 'lodash';

import { SUPPORTED_FORMATS, FILE_SIZE } from '../constants';

export function deepMapKeys(obj, mapFunc) {
  return transform(obj, (r, v, k) => {
    const value = v instanceof Object ? deepMapKeys(v, mapFunc) : v;
    r[mapFunc(k)] = value;
  });
}

export const translatedValue = (t, selectedValue) => (
  selectedValue ? { value: selectedValue.value, label: t(selectedValue.label) } : selectedValue
);

export const translatedOptions = (t, options) => (
  options.map(type => ({ value: type.value, label: t(type.label) }))
);

export function getErrorMessage(t, value) {
  const message = typeof value === 'string' ? value.match(/\D+/g) : '';
  const attributes = (message && message.pop().trim().split('_')) || [];
  const code = typeof value === 'string' ? value.match(/\d+/g) : '';
  if (code) {
    if (t(`errors.${code[0]}`).split('.')[0] === 'errors') {
      return value;
    }
    return t(`errors.${code[0]}`, { attr: t(`attributes.${attributes.pop()}`), secondAttr: code[1] || t(`attributes.${attributes.pop()}`) });
  }
  return attributes.pop();
}

export const debounce = (func, wait, immediate) => {
  let timeout;
  return (...args) => {
    const execFunc = () => func.bind(this)(...args);
    const later = () => {
      timeout = null;
      if (!immediate) execFunc();
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) execFunc();
    return timeout;
  };
};

export const isOptionAgrgs = (options, ...detectKeys) => {
  if (!isPlainObject(options)) return false;
  if (isEmpty(options)) return true;
  const keys = flatten(detectKeys);
  return Object.keys(options).every((key) => keys.includes(key));
};

export const randomString = () => Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);

export const filterValues = (values, defaltValue) => pick(values, getKeys(defaltValue));

export const addCommas = value => {
  const stringFormat = `${value}`;
  const x = stringFormat.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? `.${x[1]}` : '';
  const regex = /(\d+)(\d{3})/;
  while (regex.test(x1)) {
    x1 = x1.replace(regex, '$1,$2');
  }
  return x1 + x2;
};

export const transformDate = str => {
  const regex = /^(\d{4})\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/;
  if (regex.test(str)) {
    const parts = compact(str.split(regex));
    return `${parts[0]}-${(`0${parts[1]}`).slice(-2)}-${(`0${parts[2]}`).slice(-2)}`;
  }
  return str;
};

export function transformDeepObject(obj) {
  return transform(obj, (r, v, k) => {
    const value = v instanceof Object ? transformDeepObject(v) : v;
    r[k] = isNumber(value) || !value ? toString(value) : transformDate(value);
  });
}

export const isEqualObject = (obj1, obj2) => isEqual(transformDeepObject(obj1), transformDeepObject(obj2));

export const isValidPicture = (file) => !file || (file.type === undefined) || (SUPPORTED_FORMATS.includes(file.type) && file.size <= FILE_SIZE);

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getUTCFullYear()}/${
    (`0${d.getUTCMonth() + 1}`).slice(-2)}/${
    (`0${d.getUTCDate()}`).slice(-2)} ${
    (`0${d.getUTCHours()}`).slice(-2)}:${
    (`0${d.getUTCMinutes()}`).slice(-2)}`;
};

export const timeSince = (date, t) => {
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return formatDate(date);
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return t('hours ago', { hours: interval });
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return t('minutes ago', { minutes: interval });
  }
  return t('seconds ago', { seconds });
};

export const briefNumberFormater = (number) => {
  if (Math.abs(number) > 9999999) return number.toPrecision(2);
  return number;
};

export const roundNumber = arr => arr.map(o => mapValues(o, v => (isNumber(v) ? Math.round(v) : v)));

const shiftCharCode = charCode => c => String.fromCharCode(c.charCodeAt(0) + charCode);
export const toFullWidth = str => str.replace(/[!-~]/g, shiftCharCode(0xFEE0));
export const toHalfWidth = str => str.replace(/[！-～]/g, shiftCharCode(-0xFEE0));
