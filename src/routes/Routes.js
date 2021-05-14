import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';
import Loader from '../common/Loader/Loader';
import { AuthenticatedRoute } from './AuthenticatedRoutes';
import { ROUTES_CONSTANTS } from './constants/RoutesConstants';
import { NonAuthenticatedRoute } from './NonAuthenticatedRoutes';
import Layout from '../common/Layout/Layout';

function Routes() {
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
  }, []);

  return (
    <Router>
      <Layout>
        <Suspense fallback={<Loader />}>
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
        </Suspense>
      </Layout>
    </Router>
  );
}

export default Routes;
