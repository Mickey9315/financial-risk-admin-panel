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
    addTask: {
      title: '',
      description: '',
      priority: '',
      entityType: '',
      entityId: '',
      assigneeId: '',
      dueDate: '',
      taskFrom: 'task',
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
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

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_ADD_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          addTask: {
            ...state.task.addTask,
            [action.name]: action.value,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action.data.map(data => ({
        label: data.name,
        value: data._id,
        name: 'assigneeId',
      }));
      return {
        ...state,
        task: {
          ...state.task,
          dropDownData: {
            ...state.task.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action.data.map(data => ({
        label: data.applicationId || data.name,
        value: data._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state.task,
          addTask: {
            ...state.task.addTask,
            entityId: '',
          },
          dropDownData: {
            ...state.task.dropDownData,
            entityList,
          },
        },
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
