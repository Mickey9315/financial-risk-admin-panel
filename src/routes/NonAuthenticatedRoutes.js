import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export const NonAuthenticatedRoute = ({ escapeRedirect, component: Component, ...options }) => {
  const loggedUserDetails = useSelector(({ loggedUserProfile }) => loggedUserProfile);

  if (loggedUserDetails?.email && !escapeRedirect) {
    return (
      <Route {...options}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  return <Route {...options} component={Component} />;
};

NonAuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  escapeRedirect: PropTypes.bool,
};
NonAuthenticatedRoute.defaultProps = {
  component: null,
  escapeRedirect: false,
};
