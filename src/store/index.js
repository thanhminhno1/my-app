import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from '../reducers';
import rootSaga from '../sagas';
import middleware, { sagaMiddleware } from './middleware';

const reducer = persistReducer(
  {
    key: 'bootcamp', // key is required
    storage, // storage is now required
    whitelist: ['user'],
  },
  rootReducer(),
);

const enhancers = [];

// Dev tools are helpful
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers,
);

/* istanbul ignore next */
const configStore = (initialState = {}) => {
  const store = createStore(reducer, initialState, composedEnhancers);

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(rootReducer());
    });
  }

  store.asyncReducers = {};

  store.injectReducer = (key, _reducer) => {
    store.asyncReducers[key] = _reducer;
    store.replaceReducer(rootReducer(store.asyncReducers));
    return store;
  };

  return {
    persistor: persistStore(store),
    store,
  };
};

const { store, persistor } = configStore();

global.store = store;

export { store, persistor };
