import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export const AuthenticatedRoute = ({ component, ...options }) => {
  const loggedUserDetails = useSelector(({ loggedUserProfile }) => loggedUserProfile);

  if (!loggedUserDetails?.email) {
    return (
      <Route {...options}>
        <Redirect to="/login" />
      </Route>
    );
  }

  if (options.path !== '/dashboard' && !component) {
    return (
      <Route {...options}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  return <Route {...options} component={component} />;
};

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

AuthenticatedRoute.defaultProps = {
  component: null,
};
