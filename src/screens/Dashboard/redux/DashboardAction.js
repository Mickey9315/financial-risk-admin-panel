import {DashboardApiService} from "../services/DashboardApiService";
import {DASHBOARD_REDUX_CONSTANTS} from "./DashboardReduxConstants";
import {displayErrors} from "../../../helpers/ErrorNotifyHelper";

export const getDashboardUserList = () => {
    return async dispatch => {
        try {
            const response = await DashboardApiService.getDashboardUserList();
            if(response.data.status === 'SUCCESS') {
                dispatch({
                    type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_USER_LIST_DETAILS,
                    data: response.data.data
                })
            }
        } catch (e) {
            displayErrors(e)
        }
    }
}

export const getDashboardDetails = param => {
    return async dispatch => {
        const params = {users: param};
        try {
            const response = await DashboardApiService.getDashboardDetails(params);
            if(response.data.status === 'SUCCESS') {
                dispatch({
                    type: DASHBOARD_REDUX_CONSTANTS.DASHBOARD_DETAILS,
                    data: response.data.data
                })
            }
        } catch (e) {
            displayErrors(e)
        }
    }
}
