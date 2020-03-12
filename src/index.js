import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Spinner } from 'reactstrap';

import App from './App';
import { store, persistor } from './store';
import * as serviceWorker from './serviceWorker';

export const app = {
  run() {
    this.render(App);
  },
  render(Component) {
    const root = document.getElementById('root');
    if (root) {
      ReactDOM.render(
        <Provider store={store}>
          <PersistGate loading={<Spinner color="primary" />} persistor={persistor}>
            <Component />
          </PersistGate>
        </Provider>,
        root,
      );
    }
  }
}

app.run();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
