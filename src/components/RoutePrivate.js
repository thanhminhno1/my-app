//@ flow
import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const RoutePrivate = ({ component: Component, isAuthenticated, to, layout: Layout, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Layout>
          <Component {...props} />
        </Layout>
      ) : (
        <Redirect
          to={{
            pathname: to,
            state: { redirect: props.location.pathname, isAuthenticated },
          }}
        />
      )
    }
  />
);

RoutePrivate.defaultProps = {
  to: '/',
};

export default RoutePrivate;
