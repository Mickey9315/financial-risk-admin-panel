import { MY_WORK_REDUX_CONSTANTS } from './MyWorkReduxConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';

const initialMyWork = {
  task: {
    taskList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      headers: [],
    },
  },
};

export const myWorkReducer = (state = initialMyWork, action) => {
  switch (action.type) {
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          taskList: action.data,
        },
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
