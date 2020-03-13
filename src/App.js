import React, { Suspense, lazy } from 'react';
import { hot } from 'react-hot-loader/root';
import { Router, Switch } from 'react-router-dom';

import history from './modules/history';
import RoutePublic from './components/RoutePublic';
import { MainLayout } from './components/Layouts';

const AsyncHome = lazy(() => import('./containers/Home'));
const Login = lazy(() => import('./containers/Login'));

function App() {
  return (
    <Router history={history}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <RoutePublic
            isAuthenticated={false}
            path="/"
            exact={true}
            component={AsyncHome}
            layout={MainLayout}
          />
          <RoutePublic
            isAuthenticated={false}
            path="/login"
            component={Login}
            layout={MainLayout}
          />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default hot(App);
