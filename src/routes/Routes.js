import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import Loader from '../common/Loader/Loader';
import { AuthenticatedRoute } from './AuthenticatedRoutes';
import { ROUTES_CONSTANTS } from './constants/RoutesConstants';
import { NonAuthenticatedRoute } from './NonAuthenticatedRoutes';

function Routes() {
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
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
    </Suspense>
  );
}

export default Routes;
