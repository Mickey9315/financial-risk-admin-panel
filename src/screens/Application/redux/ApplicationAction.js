import ApplicationApiServices from '../services/ApplicationApiServices';
import { errorNotification, successNotification } from '../../../common/Toast';
import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_FILTER_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';
import ApplicationCompanyStepApiServices from '../services/ApplicationCompanyStepApiServices';
import ApplicationDocumentStepApiServices from '../services/ApplicationDocumentStepApiServices';
import ApplicationViewApiServices from '../services/ApplicationViewApiServices';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';

export const getApplicationsListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_REQUEST,
      });
      const response = await ApplicationApiServices.getApplicationListByFilter(params);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_FAILURE,
      });
      displayErrors(e);
    }
  };
};

export const resetApplicationListPaginationData = (page, pages, total, limit) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.RESET_APPLICATION_LIST_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const getApplicationColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationColumnNameList();

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeApplicationColumnNameList = data => {
  return async dispatch => {
    dispatch({
      type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveApplicationColumnNameList = ({
  applicationColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest(
        `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'application',
      };
      if (!isReset) {
        const defaultFields = applicationColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = applicationColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'application',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopLoaderButtonOnSuccessOrFail(
            `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await ApplicationApiServices.updateApplicationColumnNameList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: applicationColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');

        stopLoaderButtonOnSuccessOrFail(
          `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
        `applicationListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

// for filter of Application list
export const getApplicationFilter = () => {
  return async dispatch => {
    try {
      const response = await ApplicationApiServices.getApplicationFilter();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getApplicationDetail = applicationId => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('generateApplicationPageLoaderAction');
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.APPLICATION_DETAILS,
          data: response.data.data,
        });
        stopLoaderButtonOnSuccessOrFail('generateApplicationPageLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('generateApplicationPageLoaderAction');
      displayErrors(e);
    }
  };
};

/*
 * Contact
 * */

export const getApplicationCompanyDropDownData = () => {
  return async dispatch => {
    try {
      const response = await ApplicationCompanyStepApiServices.getApplicationCompanyStepDropdownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationCompanyDataFromDebtor = (id, params) => {
  return async dispatch => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromDebtor(
        id,
        params
      );

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS,
          isDebtor: true,
        });
        return response.data;
      }
    } catch (e) {
      throw e;
    }

    return null;
  };
};

export const getApplicationCompanyDataFromABNOrACN = params => {
  return async dispatch => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromABNorACN(
        params
      );

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS,
        });
        return response.data;
      }
    } catch (e) {
      throw e;
    }
    return null;
  };
};

export const searchApplicationCompanyEntityName = params => {
  return async dispatch => {
    try {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
        data: {
          isLoading: true,
          error: false,
          errorMessage: '',
          data: [],
        },
      });
      const response = await ApplicationCompanyStepApiServices.searchApplicationCompanyEntityName(
        params
      );

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
          data: {
            isLoading: false,
            error: false,
            errorMessage: '',
            data: response.data.data,
          },
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response?.data?.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response?.data?.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else {
          dispatch({
            type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
            data: {
              isLoading: false,
              error: true,
              errorMessage: e.response.data.message ?? 'Please try again later.',
              data: [],
            },
          });
        }
      } else {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA,
          data: {
            isLoading: false,
            error: true,
            errorMessage: 'ABR lookup facing trouble to found searched data. Please try again...',
            data: [],
          },
        });
      }
    }
  };
};

export const changeEditApplicationFieldValue = (name, value) => {
  return dispatch => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
          .APPLICATION_COMPANY_EDIT_APPLICATION_CHANGE_FIELD_VALUE,
      name,
      value,
    });
  };
};

export const resetEditApplicationFieldValue = {
  type:
    APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION.APPLICATION_COMPANY_EDIT_APPLICATION_RESET_DATA,
};

export const updateEditApplicationData = (stepName, data) => {
  return dispatch => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
          .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA,
      stepName,
      data,
    });
  };
};

export const updateEditApplicationField = (stepName, name, value) => {
  return dispatch => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
          .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_FIELD,
      stepName,
      name,
      value,
    });
  };
};
// for person step
export const addPersonDetail = type => {
  const companyData = {
    type: 'company',
    abn: '',
    acn: '',
    entityType: '',
    entityName: '',
    tradingName: '',
    errors: {},
  };

  const individualData = {
    type: 'individual',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    driverLicenceNumber: '',
    phoneNumber: '',
    mobileNumber: '',
    email: '',
    allowToCheckCreditHistory: false,
    property: '',
    unitNumber: '',
    streetNumber: '',
    streetName: '',
    streetType: '',
    suburb: '',
    state: '',
    country: '',
    postCode: '',
    errors: {},
  };
  const data = type === 'individual' ? individualData : companyData;
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.ADD_APPLICATION_PERSON,
      data,
    });
  };
};

export const removePersonDetail = index => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.REMOVE_APPLICATION_PERSON,
      data: index,
    });
  };
};
export const wipeOutPersonsAsEntityChange = (debtor, data) => {
  return async dispatch => {
    try {
      const response = await ApplicationCompanyStepApiServices.deleteApplicationCompanyEntityTypeData(
        { debtorId: debtor }
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.PERSON.WIPE_OUT_PERSON_STEP_DATA,
          data,
        });
        successNotification(response?.data?.message || 'Data deleted successfully');
      }
    } catch (e) {
      displayErrors(e);
      throw Error();
    }
  };
};

export const wipeOutIndividualPerson = (personID, index) => {
  return async dispatch => {
    try {
      const response = await ApplicationCompanyStepApiServices.deleteApplicationPersonIndividualData(
        personID
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Data deleted successfully');
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.PERSON.REMOVE_APPLICATION_PERSON,
          data: index,
        });
      }
    } catch (e) {
      displayErrors(e);
      throw Error();
    }
  };
};
// person step edit application

export const getApplicationPersonDataFromABNOrACN = (id, params) => {
  return async () => {
    try {
      const response = await ApplicationCompanyStepApiServices.getApplicationCompanyDataFromABNorACN(
        id,
        params
      );

      if (response?.data?.status === 'SUCCESS') {
        return response.data.data;
      }
    } catch (e) {
      displayErrors(e);
      throw Error();
    }
    return null;
  };
};

export const updatePersonData = (index, name, value) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.EDIT_APPLICATION_PERSON,
      index,
      name,
      value,
    });
  };
};

export const changePersonType = (index, personType) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.CHANGE_APPLICATION_PERSON_TYPE,
      index,
      personType,
    });
  };
};

export const updatePersonStepDataOnValueSelected = (index, data) => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.PERSON.PERSON_STEP_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA,
      index,
      data,
    });
  };
};

export const saveApplicationStepDataToBackend = data => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('generateApplicationSaveAndNextButtonLoaderAction');
      const response = await ApplicationApiServices.saveApplicationStepDataToBackend(data);
      if (response?.data?.status === 'SUCCESS') {
        if (response?.data?.data?.applicationStage) {
          const { _id } = response?.data?.data;
          dispatch(changeEditApplicationFieldValue('_id', _id));
        }
        successNotification(response?.data?.message || 'Application step saved successfully');
        stopLoaderButtonOnSuccessOrFail('generateApplicationSaveAndNextButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('generateApplicationSaveAndNextButtonLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};

export const getDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'application',
      };
      const response = await ApplicationDocumentStepApiServices.getDocumentTypeListData(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationDocumentDataList = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updateParams = {
        ...params,
        documentFor: 'application',
      };
      const response = await ApplicationDocumentStepApiServices.getApplicationDocumentDataList(
        id,
        updateParams
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.APPLICATION_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA,
          data: response.data.data && response.data.data.docs ? response.data.data.docs : [],
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const uploadDocument = (data, config) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('GenerateApplicationDocumentUploadButtonLoaderAction');
      const response = await ApplicationDocumentStepApiServices.uploadDocument(data, config);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DATA,
          data: response.data.data,
        });
        successNotification(response?.data?.message || 'Application document added successfully.');
        stopLoaderButtonOnSuccessOrFail('GenerateApplicationDocumentUploadButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('GenerateApplicationDocumentUploadButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteApplicationDocumentAction = async (appDocId, cb) => {
  try {
    startLoaderButtonOnRequest('generateApplicationDocumentDeleteButtonLoaderAction');
    const response = await ApplicationDocumentStepApiServices.deleteApplicationDocument(appDocId);
    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Application document deleted successfully.');
      stopLoaderButtonOnSuccessOrFail('generateApplicationDocumentDeleteButtonLoaderAction');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail('generateApplicationDocumentDeleteButtonLoaderAction');
    displayErrors(e);
  }
};

// View Application

export const getApplicationDetailById = applicationId => {
  return async dispatch => {
    try {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_REQUEST_ACTION,
      });
      const response = await ApplicationApiServices.getApplicationDetail(applicationId);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_SUCCESS_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_FAIL_ACTION,
      });
      displayErrors(e);
    }
  };
};

export const resetApplicationDetail = () => {
  return dispatch => {
    dispatch({
      type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_SUCCESS_ACTION,
      data: {},
    });
  };
};

// Application Task

export const getApplicationTaskList = id => {
  return async dispatch => {
    try {
      const data = {
        requestedEntityId: id,
        columnFor: 'application-task',
      };
      const response = await ApplicationViewApiServices.applicationTaskApiServices.getApplicationTaskListData(
        data
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
              .APPLICATION_TASK_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getAssigneeDropDownData = () => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationTaskApiServices.getAssigneeDropDownData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
              .APPLICATION_TASK_ASSIGNEE_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationTaskEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationTaskApiServices.getEntityDropDownData(
        params
      );
      if (response?.data?.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
              .APPLICATION_TASK_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationTaskDefaultEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationTaskApiServices.getEntityDropDownData(
        params
      );
      if (response?.data?.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
              .DEFAULT_APPLICATION_TASK_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateApplicationTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type:
        APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
          .APPLICATION_UPDATE_TASK_FIELD_STATUS,
      name,
      value,
    });
  };
};

export const saveApplicationTaskData = (data, backToTask) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('viewApplicationAddNewTaskButtonLoaderAction');
      const response = await ApplicationViewApiServices.applicationTaskApiServices.saveNewTask(
        data
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'New task added successfully.');
        stopLoaderButtonOnSuccessOrFail('viewApplicationAddNewTaskButtonLoaderAction');
        backToTask();
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationAddNewTaskButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const getApplicationTaskDetail = id => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationTaskApiServices.getApplicationTaskDetailById(
        id
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
              .GET_APPLICATION_TASK_DETAILS_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateApplicationTaskData = (id, data, cb) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('viewApplicationUpdateTaskButtonLoaderAction');
      const response = await ApplicationViewApiServices.applicationTaskApiServices.updateTask(
        id,
        data
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Task updated successfully.');
        stopLoaderButtonOnSuccessOrFail('viewApplicationUpdateTaskButtonLoaderAction');
        cb();
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationUpdateTaskButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteApplicationTaskAction = (taskId, cb) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('viewApplicationDeleteTaskButtonLoaderAction');
      const response = await ApplicationViewApiServices.applicationTaskApiServices.deleteTask(
        taskId
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Task deleted successfully.');
        stopLoaderButtonOnSuccessOrFail('viewApplicationDeleteTaskButtonLoaderAction');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationDeleteTaskButtonLoaderAction');
      displayErrors(e);
    }
  };
};

// Application modules
export const getApplicationModuleList = id => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationModulesApiServices.getApplicationModulesListData(
        id
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
              .APPLICATION_MODULE_LIST_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getViewApplicationDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'application',
      };
      const response = await ApplicationViewApiServices.applicationModulesApiServices.getDocumentTypeListData(
        params
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
              .VIEW_APPLICATION_DOCUMENT_TYPE_LIST_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const viewApplicationUploadDocument = (data, config) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('viewDocumentUploadDocumentButtonLoaderAction');
      const response = await ApplicationViewApiServices.applicationModulesApiServices.uploadDocument(
        data,
        config
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
              .VIEW_APPLICATION_UPLOAD_DOCUMENT_DATA,
          data: response.data.data,
        });
        successNotification(response?.data?.message || 'Document uploaded successfully.');
        stopLoaderButtonOnSuccessOrFail('viewDocumentUploadDocumentButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewDocumentUploadDocumentButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteViewApplicationDocumentAction = async (appDocId, cb) => {
  try {
    startLoaderButtonOnRequest('viewDocumentDeleteDocumentButtonLoaderAction');
    const response = await ApplicationViewApiServices.applicationModulesApiServices.deleteApplicationDocument(
      appDocId
    );
    if (response?.data?.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Document deleted successfully.');
      stopLoaderButtonOnSuccessOrFail('viewDocumentDeleteDocumentButtonLoaderAction');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    stopLoaderButtonOnSuccessOrFail('viewDocumentDeleteDocumentButtonLoaderAction');
    displayErrors(e);
  }
};

// Notes

export const getApplicationNotesList = id => {
  return async dispatch => {
    try {
      const data = {
        noteFor: 'application',
      };
      const response = await ApplicationViewApiServices.applicationNotesApiServices.getApplicationNotesListData(
        id,
        data
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_NOTES
              .APPLICATION_NOTES_LIST_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const addApplicationNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('viewApplicationAddNewNoteButtonLoaderAction');
      const { description, isPublic } = noteData;
      const data = {
        noteFor: 'application',
        entityId,
        isPublic,
        description,
      };

      const response = await ApplicationViewApiServices.applicationNotesApiServices.addApplicationNote(
        data
      );

      if (response?.data?.status === 'SUCCESS') {
        await dispatch(getApplicationNotesList(entityId));
        successNotification(response?.data?.message || 'Note added successfully.');
        stopLoaderButtonOnSuccessOrFail('viewApplicationAddNewNoteButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationAddNewNoteButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const updateApplicationNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      startLoaderButtonOnRequest('viewApplicationEditNoteButtonLoaderAction');
      const { noteId, description, isPublic } = noteData;
      const data = {
        noteFor: 'application',
        entityId,
        isPublic,
        description,
      };

      const response = await ApplicationViewApiServices.applicationNotesApiServices.updateApplicationNote(
        noteId,
        data
      );

      if (response?.data?.status === 'SUCCESS') {
        await dispatch(getApplicationNotesList(entityId));
        successNotification(response?.data?.message || 'Note updated successfully.');
        stopLoaderButtonOnSuccessOrFail('viewApplicationEditNoteButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationEditNoteButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const deleteApplicationNoteAction = (noteId, cb) => {
  return async () => {
    try {
      startLoaderButtonOnRequest('viewApplicationDeleteNoteButtonLoaderAction');
      const response = await ApplicationViewApiServices.applicationNotesApiServices.deleteApplicationNote(
        noteId
      );

      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Note deleted successfully.');
        stopLoaderButtonOnSuccessOrFail('viewApplicationDeleteNoteButtonLoaderAction');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationDeleteNoteButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const changeApplicationStatus = (applicationId, status, statusToChange) => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.changeApplicationStatus(
        applicationId,
        status
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Application status updated successfully.');
        dispatch({
          type: APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_STATUS_CHANGE_ACTION,
          data: statusToChange,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// reports
export const getApplicationReportsListData = id => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationReportsApiServices.getDebtorsReportListData(
        id
      );
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_REPORTS
              .APPLICATION_REPORTS_LIST_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getApplicationReportsListForFetch = () => {
  return async dispatch => {
    try {
      const response = await ApplicationViewApiServices.applicationReportsApiServices.getApplicationReportListDataForFetch();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type:
            APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_REPORTS
              .FETCH_APPLICATION_REPORTS_LIST_DATA_FOR_FETCH,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const fetchSelectedReportsForApplication = data => {
  return async () => {
    try {
      startLoaderButtonOnRequest('viewApplicationFetchReportButtonLoaderAction');
      const response = await ApplicationViewApiServices.applicationReportsApiServices.fetchSelectedReportsForApplication(
        data
      );
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Reports fetched successfully');
        stopLoaderButtonOnSuccessOrFail('viewApplicationFetchReportButtonLoaderAction');
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail('viewApplicationFetchReportButtonLoaderAction');
      displayErrors(e);
    }
  };
};
