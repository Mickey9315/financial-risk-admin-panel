import { MY_WORK_REDUX_CONSTANTS } from './MyWorkReduxConstants';

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
      priority: [],
      entityType: [],
      entityId: [],
      assigneeId: [],
      dueDate: '',
      taskFrom: 'task',
    },
    taskDetail: {},
    dropDownData: {
      assigneeList: [],
      entityList: [],
    },
    columnList: {},
    filterDropDownData: {
      assigneeList: [],
    },
  },
};

export const myWorkReducer = (state = initialMyWork, action) => {
  switch (action.type) {
    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: action?.data,
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_ADD_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            [action?.name]: action?.value,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action?.data?.map(data => ({
        label: data?.applicationId || data?.name,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            entityId: [],
          },
          taskDetail: {
            ...state?.task?.taskDetail,
            entityId: [],
          },
          dropDownData: {
            ...state?.task?.dropDownData,
            entityList,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            title: '',
            description: '',
            priority: [],
            entityType: [],
            entityId: [],
            assigneeId: [],
            dueDate: '',
            taskFrom: 'task',
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_PAGE_DATA: {
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: {
            ...state?.task?.taskList,
            page: 1,
            limit: 15,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          columnList: action?.data,
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_TASK_COLUMN_NAME_LIST_ACTION: {
      const columnList = {
        ...state?.task?.columnList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`]?.map(e =>
        e?.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        task: {
          ...state?.task,
          columnList,
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ASSIGNEE_DROP_DOWN_DATA_FOR_FILTER: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          filterDropDownData: {
            ...state?.task?.filterDropDownData,
            assigneeList,
          },
        },
      };
    }

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_DETAIL_BY_ID_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {
            defaultEntityId: action?.data?.entityId,
            ...action?.data,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_EDIT_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {
            ...state?.task?.taskDetail,
            [action?.name]: action?.value,
          },
        },
      };

    case MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskDetail: {},
        },
      };
    default:
      return state;
  }
};
