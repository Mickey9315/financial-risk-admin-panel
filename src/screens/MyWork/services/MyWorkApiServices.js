import ApiService from '../../../services/api-service/ApiService';
import { MY_WORK_URL } from '../../../constants/UrlConstants';

const MyWorkApiServices = {
  getTaskListData: params => ApiService.getData(MY_WORK_URL.TASK.TASK_LIST_URL, { params }),
  getAssigneeDropDownData: () => ApiService.getData(MY_WORK_URL.TASK.ASSIGNEE_DROP_DOWN_DATA),
  getEntityDropDownData: params =>
    ApiService.getData(MY_WORK_URL.TASK.ENTITY_DROP_DOWN_DATA, { params }),
  saveNewTask: data => ApiService.postData(MY_WORK_URL.TASK.SAVE_NEW_TASK, data),
  getColumnNameList: params =>
    ApiService.getData(MY_WORK_URL.TASK.COLUMN_NAME_LIST_URL, { params }),
  saveColumnNameList: data => ApiService.putData(MY_WORK_URL.TASK.COLUMN_NAME_LIST_URL, data),
  getTaskFilterListData: () => ApiService.getData(MY_WORK_URL.TASK.ASSIGNEE_DROP_DOWN_DATA),
  deleteTask: taskId => ApiService.deleteData(`${MY_WORK_URL.TASK.TASK_LIST_URL}${taskId}`),
  getTaskDetailById: id => ApiService.getData(`${MY_WORK_URL.TASK.TASK_DETAIL_BY_ID_URL}${id}`),
  updateTask: (id, data) => ApiService.putData(`${MY_WORK_URL.TASK.UPDATE_TASK}${id}`, data),

  notification: {
    getMyWorkNotificationListData: params =>
      ApiService.getData(MY_WORK_URL.MY_WORK_NOTIFICATION.MY_WORK_NOTIFICATION_LIST, { params }),
    deleteMyWorkNotificationData: id =>
      ApiService.deleteData(`${MY_WORK_URL.MY_WORK_NOTIFICATION.MY_WORK_DELETE_NOTIFICATION}${id}`),
  },
};
export default MyWorkApiServices;
