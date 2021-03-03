import ApplicationApiServices from '../services/ApplicationApiServices';
import { errorNotification } from '../../../common/Toast';
import { APPLICATION_REDUX_CONSTANTS } from './ApplicationReduxConstants';

export const getApplicationsListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const responce = await ApplicationApiServices.getApplicationListByFilter(params);
      console.log('RESPONCE OF GET APPLICATION LIST ', responce);
      if (responce.data.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST,
          data: responce.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
