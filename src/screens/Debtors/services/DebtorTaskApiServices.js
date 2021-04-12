import ApiService from '../../../services/api-service/ApiService';
import { DEBTORS_URLS } from '../../../constants/UrlConstants';

const DebtorTaskApiService = {
  getDebtorTaskListData: params => ApiService.getData(DEBTORS_URLS.TASK.TASK_LIST_URL, { params }),
  getDebtorTaskColumnNameList: params =>
    ApiService.getData(DEBTORS_URLS.TASK.TASK_COLUMN_NAME_LIST_URL, { params }),
  updateDebtorTaskColumnNameList: data =>
    ApiService.putData(DEBTORS_URLS.TASK.TASK_COLUMN_NAME_LIST_URL, data),

  // delete task
  deleteTask: taskId => ApiService.deleteData(`${DEBTORS_URLS.TASK.TASK_LIST_URL}${taskId}`),

  // add task
  getAssigneeDropDownData: () =>
    ApiService.getData(DEBTORS_URLS.TASK.ADD_TASK.ASSIGNEE_DROP_DOWN_DATA),
  getEntityDropDownData: params =>
    ApiService.getData(DEBTORS_URLS.TASK.ADD_TASK.ENTITY_DROP_DOWN_DATA, { params }),
  saveNewTask: data => ApiService.postData(DEBTORS_URLS.TASK.ADD_TASK.SAVE_NEW_TASK, data),

  // edit task
  getDebtorTaskDetailById: id =>
    ApiService.getData(`${DEBTORS_URLS.TASK.EDIT_TASK.GET_DEBTOR_TASK_DETAIL}${id}`),
  updateTask: (id, data) =>
    ApiService.putData(`${DEBTORS_URLS.TASK.ADD_TASK.SAVE_NEW_TASK}${id}`, data),
};
export default DebtorTaskApiService;
