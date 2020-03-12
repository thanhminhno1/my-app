// @flow
import axios from 'axios';
import { isArray, each, mapKeys, snakeCase, camelCase, split } from 'lodash';

import { clearUserData } from '../../actions/authAction';
import { store, PERSIST_KEY } from '../../store';
import history from '../RoutingService';
import { deepMapKeys } from '../../utils/commonUtils';

const DEFAULT_API_CONFIG = {
  baseURL: '/api/v1',
  timeout: 30000,
  apiVersion: 'v1',
};

const ERROR_CODES = {
  uncaught: 700,
  unauthenticated: 401,
};

const ERROR_MESSAGES = {
  uncaught: 'serverdown',
};

export default class V1 {
  client;

  constructor(config = {}) {
    this.client = axios.create({
      ...DEFAULT_API_CONFIG,
      ...config,
    });
    this._requestInterceptor();
    this._responseInterceptor();
  }

  _requestInterceptor() {
    this.client.interceptors.request.use(config => {
      if (!this._isFormDataRequest(config)) {
        const returnKey = key => (key === '_destroy' ? key : snakeCase(key));
        config.data = deepMapKeys(config.data, returnKey);
      }
      return config;
    });
  }

  _isFormDataRequest(config) {
    return config.data && config.data.toString().includes('FormData');
  }

  _responseInterceptor() {
    this.client.interceptors.response.use(res => {
      if (res.data) res.data = deepMapKeys(res.data, key => camelCase(key));
      return res;
    }, error => {
      if (!error.response || error.response.status === 500) {
        throw Object.assign({ error_code: ERROR_CODES.uncaught, message: ERROR_MESSAGES.uncaught });
      }
      error.response.data = this._camelCaseErrorResponse(error.response.data);
      if (error.response && this._logoutIfUnauthenticated(error)) throw error.response.data;
      throw error.response.data;
    });
  }

  _camelCaseErrorResponse(error) {
    if (error.details) {
      error.details = mapKeys(error.details, (value, key) => camelCase(split(key, '.').pop()));
    }
    return mapKeys(error, (value, key) => camelCase(key));
  }

  _logoutIfUnauthenticated(error) {
    if (error.response.status === ERROR_CODES.unauthenticated) {
      store.dispatch(clearUserData());
      localStorage.removeItem(PERSIST_KEY);
      history.replace('/users/sign-in');
    }
  }

  _buildFormData(values, { keyMaps = {}, jsonAsArray = false } = {}) {
    const formData = new FormData();
    each(values, (value, key) => {
      const k = keyMaps[key] || snakeCase(key);
      if (isArray(value) && jsonAsArray) {
        formData.append(k, JSON.stringify(value));
      } else if (isArray(value)) {
        value.forEach(v => formData.append(`${k}[]`, v));
      } else {
        formData.append(k, value);
      }
    });
    return formData;
  }
}
