/*
import { errorNotification } from '../../../common/Toast';
import InsurerApiService from '../services/InsurerApiService';
import { INSURER_REDUX_CONSTANTS } from './InsurerReduxConstants';

export const getInsurerListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await InsurerApiService.getAllInsurerListByFilter(params);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: INSURER_REDUX_CONSTANTS.INSURER_LIST_USER_ACTION,
          data: response.data.data,
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
*/
