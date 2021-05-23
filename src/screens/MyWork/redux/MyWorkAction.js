import MyWorkApiServices from '../services/MyWorkApiServices';
import { MY_WORK_REDUX_CONSTANTS } from './MyWorkReduxConstants';
import { errorNotification, successNotification } from '../../../common/Toast';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';

export const getTaskListByFilter = (params = {}) => {
  return async dispatch => {
    const param = {
      ...params,
      columnFor: 'task',
    };
    try {
      dispatch({
        type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_LIST_REQUEST_ACTION,
      });
      const response = await MyWorkApiServices.getTaskListData(param);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_LIST_SUCCESS_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_LIST_FAIL_ACTION,
      });
      displayErrors(e);
    }
  };
};

export const getAssigneeDropDownData = () => {
  return async dispatch => {
    try {
      const response = await MyWorkApiServices.getAssigneeDropDownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS
              .MY_WORK_ASSIGNEE_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await MyWorkApiServices.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS
              .MY_WORK_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const removeUpdateTaskEntityId = () => {
  return dispatch => {
    dispatch({
      type:
        MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_TASK_UPDATE_ENTITY_ID,
    });
  };
};

export const removeAddTaskEntityId = () => {
  return dispatch => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_ADD_TASK_ENTITY_ID,
    });
  };
};

export const updateAddTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type:
        MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.MY_WORK_UPDATE_ADD_TASK_FIELD_ACTION,
      name,
      value,
    });
  };
};

export const saveTaskData = (data, backToTask) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('myWorkSaveNewTaskLoaderButtonAction');
      const response = await MyWorkApiServices.saveNewTask(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task created successfully');
        stopLoaderButtonOnSuccessOrFail('myWorkSaveNewTaskLoaderButtonAction');
        backToTask();
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('myWorkSaveNewTaskLoaderButtonAction');
      displayErrors(e);
    }
  };
};

export const resetMyWorkPaginationData = (page, pages, limit, total) => {
  return async dispatch => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_MY_WORK_TASK_PAGINATION_DATA,
      page,
      pages,
      limit,
      total,
    });
  };
};

export const getTaskListColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'task',
      };
      const response = await MyWorkApiServices.getColumnNameList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.TASK_COLUMN_NAME_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS
              .TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeTaskListColumnStatus = data => {
  return async dispatch => {
    dispatch({
      type:
        MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_TASK_COLUMN_NAME_LIST_ACTION,
      data,
    });
  };
};

export const saveTaskListColumnListName = ({ taskColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(
        `myWorkTaskColumns${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'task',
      };
      if (!isReset) {
        const defaultFields = taskColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = taskColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'task',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `myWorkTaskColumns${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await MyWorkApiServices.saveColumnNameList(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS
              .TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: taskColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
        stopLoaderButtonOnSuccessOrFail(
          `myWorkTaskColumns${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `myWorkTaskColumns${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const getTaskFilter = () => {
  return async dispatch => {
    try {
      const response = await MyWorkApiServices.getAssigneeDropDownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.ASSIGNEE_DROP_DOWN_DATA_FOR_FILTER,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteTaskAction = (taskId, cb) => {
  return async () => {
    try {
      const response = await MyWorkApiServices.deleteTask(taskId);
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Task deleted successfully.');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getTaskById = id => {
  return async dispatch => {
    try {
      const response = await MyWorkApiServices.getTaskDetailById(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.GET_TASK_DETAIL_BY_ID_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateEditTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.UPDATE_EDIT_TASK_FIELD_ACTION,
      name,
      value,
    });
  };
};

export const editTaskData = (id, data, backToTask) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('myWorkEditTaskLoaderButtonAction');

      const response = await MyWorkApiServices.updateTask(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: MY_WORK_REDUX_CONSTANTS.MY_WORK_TASK_REDUX_CONSTANTS.RESET_EDIT_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task updated successfully');
        stopLoaderButtonOnSuccessOrFail('myWorkEditTaskLoaderButtonAction');

        backToTask();
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('myWorkEditTaskLoaderButtonAction');
      displayErrors(e);
    }
  };
};

export const getMyWorkNotificationList = (params = {}) => {
  return async dispatch => {
    try {
      await dispatch({
        type:
          MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
            .GET_MY_WORK_NOTIFICATION_LIST_REQUEST_ACTION,
      });
      const response = await MyWorkApiServices.notification.getMyWorkNotificationListData(params);
      if (response?.data?.status === 'SUCCESS') {
        await dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
              .GET_MY_WORK_NOTIFICATION_LIST_SUCCESS_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      await dispatch({
        type:
          MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
            .GET_MY_WORK_NOTIFICATION_LIST_FAIL_ACTION,
      });
      displayErrors(e);
    }
  };
};
export const deleteMyWorkNotification = notificationId => {
  return async dispatch => {
    try {
      const response = await MyWorkApiServices.notification.deleteMyWorkNotificationData(
        notificationId
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Notification deleted successfully');
        dispatch({
          type:
            MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS
              .DELETE_MY_WORK_NOTIFICATION_ACTION,
          data: notificationId,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const clearNotificationData = () => {
  return dispatch => {
    dispatch({
      type: MY_WORK_REDUX_CONSTANTS.MY_WORK_NOTIFICATION_REDUX_CONSTANTS.CLEAR_NOTIFICATION_DATA,
    });
  };
};
