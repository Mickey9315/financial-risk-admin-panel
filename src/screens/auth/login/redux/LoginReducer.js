import {LOGIN_REDUX_CONSTANTS} from "./LoginReduxConstants";

export const loggedUser = (state = null, action) => {
    switch (action.type) {
        case LOGIN_REDUX_CONSTANTS.LOGIN_USER_ACTION:
            return action.data;

        case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
            return null;

        default:
            return state;
    }
};
