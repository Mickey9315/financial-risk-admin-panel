import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import { AuthenticatedRoute } from './AuthenticatedRoutes';
import { ROUTES_CONSTANTS } from './constants/RoutesConstants';
import { NonAuthenticatedRoute } from './NonAuthenticatedRoutes';

function Routes() {
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
  }, []);

  return (
    <Router>
      <Switch>
        {ROUTES_CONSTANTS.map(({ path, component, authenticated, escapeRedirect }) => {
          const Component = authenticated ? AuthenticatedRoute : NonAuthenticatedRoute;

          return (
            <Component
              key={path}
              exact
              path={path}
              component={component}
              escapeRedirect={escapeRedirect}
            />
          );
        })}
      </Switch>
    </Router>
  );
}

export default Routes;
