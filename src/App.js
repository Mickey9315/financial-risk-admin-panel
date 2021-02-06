import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import LoginScreen from "./screens/auth/login/LoginScreen";
import ForgotPassword from "./screens/auth/ForgotPassword/ForgotPassword";
import Dashboard from "./common/Dashboard/Dashboard";
import {Provider} from "react-redux";
import store from "./redux/store";

function App() {
    return (
            <Provider store={store}>
                <Router>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/login"/>
                        </Route>
                        <Route exact path="/login" component={LoginScreen}/>
                        <Route exact path="/login/:screenType" component={ForgotPassword}/>
                        <Route exact path="/dashboard" component={Dashboard}/>
                    </Switch>
                </Router>
            </Provider>
    );
}

export default App;
