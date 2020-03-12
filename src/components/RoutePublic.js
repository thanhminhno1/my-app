//@ flow
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const RoutePublic = ({ component: Component, isAuthenticated, to, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={props => (isAuthenticated ? <Redirect to={to} /> : <Layout><Component {...props} /></Layout>)}
  />
);

RoutePublic.defaultProps = {
  to: '/private',
};

export default RoutePublic;
