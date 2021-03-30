import MyWorkApiServices from '../services/MyWorkApiServices';
import { MY_WORK_REDUX_CONSTANTS } from './MyWorkReduxConstants';
import { errorNotification } from '../../../common/Toast';

export const getTaskListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await MyWorkApiServices.getTaskListData(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_LIST_ACTION,
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
