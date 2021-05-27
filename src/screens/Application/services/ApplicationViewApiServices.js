import ApiService from '../../../services/api-service/ApiService';
import { APPLICATION_URLS } from '../../../constants/UrlConstants';

const ApplicationViewApiServices = {
  changeApplicationStatus: (applicationId, status) =>
    ApiService.putData(
      `${APPLICATION_URLS.VIEW_APPLICATION.CHANGE_APPLICATION_STATUS}${applicationId}`,
      status
    ),
  applicationTaskApiServices: {
    getApplicationTaskListData: params =>
      ApiService.getData(APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.GET_TASK_LIST, {
        params,
      }),
    getAssigneeDropDownData: () =>
      ApiService.getData(
        APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.ASSIGNEE_DROP_DOWN_DATA
      ),
    getEntityDropDownData: params =>
      ApiService.getData(APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.ENTITY_DROP_DOWN_DATA, {
        params,
      }),
    saveNewTask: data =>
      ApiService.postData(APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.SAVE_NEW_TASK, data),
    updateTask: (id, data) =>
      ApiService.putData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.SAVE_NEW_TASK}${id}`,
        data
      ),
    getApplicationTaskDetailById: id =>
      ApiService.getData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.GET_APPLICATION_TASK_DETAIL}${id}`
      ),
    deleteTask: taskId =>
      ApiService.deleteData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_TASK.GET_TASK_LIST}${taskId}`
      ),
  },
  applicationModulesApiServices: {
    getApplicationModulesListData: id =>
      ApiService.getData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_MODULES.GET_MODULE_LIST}${id}`
      ),
    getDocumentTypeListData: params =>
      ApiService.getData(
        APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_MODULES.GET_DOCUMENT_TYPE_LIST_URL,
        { params }
      ),
    uploadDocument: (data, config) =>
      ApiService.postData(
        APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_MODULES.UPLOAD_DOCUMENT_URL,
        data,
        config
      ),
    deleteApplicationDocument: id =>
      ApiService.deleteData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_MODULES.DELETE_DOCUMENT_URL}${id}`
      ),
  },
  applicationNotesApiServices: {
    getApplicationNotesListData: (id, params) =>
      ApiService.getData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_NOTES.GET_NOTES_LIST}${id}`,
        { params }
      ),
    addApplicationNote: data =>
      ApiService.postData(APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_NOTES.GET_NOTES_LIST, data),
    updateApplicationNote: (id, data) =>
      ApiService.putData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_NOTES.GET_NOTES_LIST}${id}`,
        data
      ),
    deleteApplicationNote: id =>
      ApiService.deleteData(
        `${APPLICATION_URLS.VIEW_APPLICATION.APPLICATION_NOTES.GET_NOTES_LIST}${id}`
      ),
  },
};
export default ApplicationViewApiServices;
