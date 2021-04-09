import ApiService from '../../../services/api-service/ApiService';
import { CLIENT_URLS } from '../../../constants/UrlConstants';

const ClientTaskApiService = {
  getClientTaskListData: params => ApiService.getData(CLIENT_URLS.TASK.TASK_LIST_URL, { params }),
  getClientTaskColumnNameList: params =>
    ApiService.getData(CLIENT_URLS.TASK.TASK_COLUMN_NAME_LIST_URL, { params }),
  updateClientTaskColumnNameList: data =>
    ApiService.putData(CLIENT_URLS.TASK.TASK_COLUMN_NAME_LIST_URL, data),

  // delete task
  deleteTask: taskId => ApiService.deleteData(`${CLIENT_URLS.TASK.TASK_LIST_URL}${taskId}`),

  // add task
  getAssigneeDropDownData: () =>
    ApiService.getData(CLIENT_URLS.TASK.ADD_TASK.ASSIGNEE_DROP_DOWN_DATA),
  getEntityDropDownData: params =>
    ApiService.getData(CLIENT_URLS.TASK.ADD_TASK.ENTITY_DROP_DOWN_DATA, { params }),
  saveNewTask: data => ApiService.postData(CLIENT_URLS.TASK.ADD_TASK.SAVE_NEW_TASK, data),

  // edit task
  getClientTaskDetailById: id =>
    ApiService.getData(`${CLIENT_URLS.TASK.EDIT_TASK.GET_CLIENT_TASK_DETAIL}${id}`),
  updateTask: (id, data) =>
    ApiService.putData(`${CLIENT_URLS.TASK.ADD_TASK.SAVE_NEW_TASK}${id}`, data),
};
export default ClientTaskApiService;
