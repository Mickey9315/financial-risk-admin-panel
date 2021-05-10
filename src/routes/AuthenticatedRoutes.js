import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Layout from '../common/Layout/Layout';

export const AuthenticatedRoute = ({ component: Component, ...options }) => {
  const loggedUserDetails = useSelector(({ loggedUserProfile }) => loggedUserProfile);

  if (!loggedUserDetails?.email) {
    return (
      <Route {...options}>
        <Redirect to="/login" />
      </Route>
    );
  }

  if (!Component) {
    if (options.path !== '/dashboard') {
      return (
        <Route {...options}>
          <Redirect to="/dashboard" />
        </Route>
      );
    }

    return <Route {...options} component={Layout} />;
  }

  return (
    <Route
      {...options}
      render={() => (
        <Layout>
          <Component />
        </Layout>
      )}
    />
  );
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AuthenticatedRoute.defaultProps = {
  component: null,
};
