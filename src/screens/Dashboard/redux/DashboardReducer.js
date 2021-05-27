import {DASHBOARD_REDUX_CONSTANTS} from "./DashboardReduxConstants";

const initialDashboardData = {
    dashboardDetails: {},
    dashboardUserList: []
}

export const dashboard = (state=initialDashboardData, action) =>{
    switch(action.type) {
        case DASHBOARD_REDUX_CONSTANTS.DASHBOARD_USER_LIST_DETAILS:
            return {
                ...state,
                dashboardUserList: action.data
            }

        case DASHBOARD_REDUX_CONSTANTS.DASHBOARD_DETAILS:
            return {
                ...state,
                dashboardDetails: action.data
            }

        default:
            return state;
    }
}
