import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.production.min';
import LoginScreen from '../screens/auth/login/LoginScreen';
import ForgotPassword from '../screens/auth/forgotPassword/ForgotPassword';
import Dashboard from '../common/Dashboard/Dashboard';
import { saveTokenFromLocalStorageToSession } from '../helpers/LocalStorageHelper';

function Routes() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  //
  useEffect(() => {
    saveTokenFromLocalStorageToSession();
    //   if (SESSION_STORAGE.USER_TOKEN) {
    //     setIsLoggedIn(true);
    //   }
  }, []);

  return (
    <Router>
      <Switch>
        {/* {isLoggedIn ? ( */}
        {/*  <> */}
        {/*  </> */}
        {/* ) : ( */}
        {/*  <> */}
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/login" component={LoginScreen} />
        <Route exact path="/forgot-password/:screenType" component={ForgotPassword} />
        {/* </> */}
        {/* )} */}
      </Switch>
    </Router>
  );
}

export default Routes;
