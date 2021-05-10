import { errorNotification, successNotification } from '../../../common/Toast';
import DebtorsApiServices from '../services/DebtorsApiServices';
import DebtorsNotesApiService from '../services/DebtorsNotesApiService';
import {
  DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  DEBTORS_REDUX_CONSTANTS,
} from './DebtorsReduxConstants';
import DebtorsDocumentApiServices from '../services/DebtorsDocumentApiServices';
import DebtorTaskApiService from '../services/DebtorTaskApiServices';
import DebtorApplicationApiServices from '../services/DebtorApplicationApiServices';
import DebtorCreditLimitApiServices from '../services/DebtorCreditLimitApiServices';
import DebtorStakeHolderApiServices from '../services/DebtorStakeHolderApiServices';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const getDebtorsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getAllDebtorsList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_FAILURE,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorsColumnNameList = () => {
  return async dispatch => {
    const params = {
      columnFor: 'debtor',
    };
    try {
      const response = await DebtorsApiServices.getDebtorsColumnNameList(params);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type:
            DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorsColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type:
        DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorsColumnListName = ({ debtorsColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'debtor',
      };
      if (!isReset) {
        const defaultFields = debtorsColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false,
          columnFor: 'debtor',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }
      const response = await DebtorsApiServices.updateDebtorsColumnNameList(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const resetDebtorListPaginationData = (page, pages, total, limit) => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.DEBTOR_LIST_RESET_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const getDebtorById = id => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getDebtorDetailById(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.SELECTED_DEBTORS_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDebtorDropdownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getDebtorDropdownDataList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorData = (name, value) => {
  return async dispatch => {
    dispatch({
      type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION,
      name,
      value,
    });
  };
};

export const OnChangeCountry = value => {
  return async dispatch => {
    dispatch({
      type:
        DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_STATE_LIST_ACTION,
      value,
    });
  };
};

export const updateDebtorData = (id, finalData, cb) => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.updateDebtorDetailById(id, finalData);
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Debtor details updated successfully');
        dispatch(getDebtorById(id));
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// DEBTORS NOTES TAB

export const getDebtorsNotesListDataAction = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        noteFor: 'debtor',
      };

      const response = await DebtorsNotesApiService.getDebtorsNotesList(id, updatedParams);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const addDebtorsNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      const { description, isPublic } = noteData;
      const data = {
        noteFor: 'debtor',
        entityId,
        isPublic,
        description,
      };

      const response = await DebtorsNotesApiService.addDebtorsNote(data);

      if (response.data.status === 'SUCCESS') {
        await dispatch(getDebtorsNotesListDataAction(entityId));
        successNotification(response?.data?.message || 'Note added successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateDebtorsNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      const { noteId, description, isPublic } = noteData;
      const data = {
        noteFor: 'debtor',
        entityId,
        isPublic,
        description,
      };

      const response = await DebtorsNotesApiService.updateDebtorsNote(noteId, data);

      if (response.data.status === 'SUCCESS') {
        await dispatch(getDebtorsNotesListDataAction(entityId));
        successNotification(response?.data?.message || 'Note updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteDebtorsNoteAction = async (noteId, cb) => {
  try {
    const response = await DebtorsNotesApiService.deleteDebtorsNote(noteId);

    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Note deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    displayErrors(e);
  }
};

/* documents action */

export const getDebtorDocumentsListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        documentFor: 'debtor',
      };

      const response = await DebtorsDocumentApiServices.getDebtorDocumentsList(id, updatedParams);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorDocumentsColumnNamesList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-document',
      };

      const response = await DebtorsDocumentApiServices.getDebtorDocumentsColumnNamesList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type:
            DEBTORS_REDUX_CONSTANTS.DOCUMENTS
              .DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorDocumentsColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPDATE_DEBTOR_DOCUMENTS_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorDocumentsColumnListName = ({
  debtorsDocumentColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-document',
      };

      if (!isReset) {
        const defaultColumns = debtorsDocumentColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsDocumentColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }
      const response = await DebtorsDocumentApiServices.updateDebtorDocumentColumnListName(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        dispatch({
          type:
            DEBTORS_REDUX_CONSTANTS.DOCUMENTS
              .DEBTOR_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsDocumentColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDocumentTypeList = () => {
  return async dispatch => {
    try {
      const params = {
        listFor: 'debtor',
      };

      const response = await DebtorsDocumentApiServices.getDocumentTypeList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENT_TYPE_LIST_USER_ACTION,
          data: response.data.data,
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
      const response = await DebtorsDocumentApiServices.uploadDocument(data, config);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DEBTOR_ACTION,
          data: response.data.data,
        });
        successNotification(response.data.message || 'Document uploaded successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const downloadDocuments = async data => {
  const str = data.toString();

  try {
    const config = {
      documentIds: str,
      action: 'download',
    };

    const response = await DebtorsDocumentApiServices.downloadDocuments(config);
    if (response.statusText === 'OK') {
      return response;
    }
  } catch (e) {
    displayErrors(e);
  }
  return false;
};

export const deleteDebtorDocumentAction = async (docId, cb) => {
  try {
    const response = await DebtorsDocumentApiServices.deleteDebtorDocument(docId);
    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Document deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    displayErrors(e);
  }
};

// tasks
export const getDebtorTaskListData = (params, id) => {
  return async dispatch => {
    try {
      const data = {
        ...params,
        requestedEntityId: id,
      };
      const response = await DebtorTaskApiService.getDebtorTaskListData(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorTaskColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-task',
      };
      const response = await DebtorTaskApiService.getDebtorTaskColumnNameList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_COLUMN_NAME_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorTaskColumnNameListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.TASK.UPDATE_DEBTOR_TASK_COLUMN_NAME_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorTaskColumnNameListName = ({
  debtorsTaskColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-task',
      };

      if (!isReset) {
        const defaultColumns = debtorsTaskColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsTaskColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }

      const response = await DebtorTaskApiService.updateDebtorTaskColumnNameList(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: debtorsTaskColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getAssigneeDropDownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getAssigneeDropDownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ASSIGNEE_DROP_DOWN_DATA_ACTION,
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
      const response = await DebtorTaskApiService.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDebtorDefaultEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type:
            DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK
              .DEBTOR_DEFAULT_DEBTOR_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateAddTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_UPDATE_ADD_TASK_FIELD_ACTION,
      name,
      value,
    });
  };
};

export const saveTaskData = (data, cb) => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.saveNewTask(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task created successfully');
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteTaskAction = (taskId, cb) => {
  return async () => {
    try {
      const response = await DebtorTaskApiService.deleteTask();
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

export const getDebtorTaskDetail = id => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getDebtorTaskDetailById(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_DEBTOR_TASK_DETAILS_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateTaskData = (id, data, cb) => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.updateTask(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEBTOR_RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task updated successfully');
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// Application
export const getDebtorApplicationListData = (id, param) => {
  return async dispatch => {
    try {
      const params = {
        ...param,
        listFor: 'debtor-application',
      };
      const response = await DebtorApplicationApiServices.getApplicationListData(id, params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorApplicationColumnNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-application',
      };
      const response = await DebtorApplicationApiServices.getDebtorApplicationColumnNameList(
        params
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorApplicationColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.APPLICATION.UPDATE_DEBTOR_APPLICATION_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorApplicationColumnNameList = ({
  debtorsApplicationColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-application',
      };
      if (!isReset) {
        const defaultFields = debtorsApplicationColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsApplicationColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }

      const response = await DebtorApplicationApiServices.updateDebtorApplicationColumnNameList(
        data
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsApplicationColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// credit limit
export const getDebtorCreditLimitData = (id, data) => {
  return async dispatch => {
    try {
      const response = await DebtorCreditLimitApiServices.getDebtorCreditLimitList(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCreditLimitColumnsNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'debtor-credit-limit',
      };
      const response = await DebtorCreditLimitApiServices.getDebtorCreditLimitColumnNameList(
        params
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorCreditLimitColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorCreditLimitColumnNameList = ({
  debtorsCreditLimitColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'debtor-credit-limit',
      };
      if (!isReset) {
        const defaultFields = debtorsCreditLimitColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsCreditLimitColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'debtor-credit-limit',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }

      const response = await DebtorCreditLimitApiServices.updateDebtorCreditLimitColumnNameList(
        data
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsCreditLimitColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// Stake Holder
export const getDebtorStakeHolderListData = (id, param) => {
  return async dispatch => {
    try {
      const params = {
        ...param,
      };
      const response = await DebtorStakeHolderApiServices.getStakeHolderListData(id, params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

export const getDebtorStakeHolderColumnNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'stakeholder',
      };
      const response = await DebtorStakeHolderApiServices.getDebtorStakeHolderColumnNameList(
        params
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeDebtorStakeHolderColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.UPDATE_DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveDebtorStakeHolderColumnNameList = ({
  debtorsStakeHolderColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'stakeholder',
      };
      if (!isReset) {
        const defaultFields = debtorsStakeHolderColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsStakeHolderColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }
      const response = await DebtorStakeHolderApiServices.updateDebtorStakeHolderColumnNameList(
        data
      );
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_DEFAULT_COLUMN_LIST_ACTION,
          data: debtorsStakeHolderColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeStakeHolderPersonType = personType => {
  return dispatch => {
    dispatch({
      type:
        DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD
          .CHANGE_DEBTOR_STAKE_HOLDER_PERSON_TYPE,
      personType,
    });
  };
};

export const updateStakeHolderDetail = (name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.UPDATE_STAKE_HOLDER_FIELDS,
      name,
      value,
    });
  };
};

export const getStakeHolderDropDownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.getStakeHolderDropdownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKEHOLDER_DROPDOWN_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getStakeHolderCompanyDataFromABNorACN = async id => {
  try {
    const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.getStakeHolderCompanyDataFromABNorACN(
      id
    );

    if (response.data.status === 'SUCCESS') {
      return response.data.data;
    }
  } catch (e) {
    displayErrors(e);
  }
  return null;
};

export const updateStakeHolderDataOnValueSelected = data => {
  return dispatch => {
    dispatch({
      type:
        DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.UPDATE_STAKE_HOLDER_COMPANY_ALL_DATA,
      data,
    });
  };
};

export const searchStakeHolderCompanyEntityName = searchText => {
  return async dispatch => {
    try {
      dispatch({
        type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
        data: {
          isLoading: true,
          error: false,
          errorMessage: '',
          data: [],
        },
      });
      const params = { searchString: searchText };
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.searchStakeHolderCompanyEntityName(
        params
      );

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
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
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else {
          dispatch({
            type:
              DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
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
          type:
            DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.STAKE_HOLDER_ENTITY_TYPE_DATA,
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

export const addNewStakeHolder = (id, data, cb) => {
  return async dispatch => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.addNewStakeHolder(
        id,
        data
      );
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Stakeholder created successfully');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.RESET_STAKE_HOLDER_STATE,
        });
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateStakeHolder = (debtorId, stakeHolderId, data, cb) => {
  return async dispatch => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.updateStakeHolder(
        debtorId,
        stakeHolderId,
        data
      );
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Stakeholder updated successfully');
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.RESET_STAKE_HOLDER_STATE,
        });
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteStakeHolderDetails = (stakeHolderId, cb) => {
  return async () => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.deleteStakeHolder(
        stakeHolderId
      );
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Stakeholder deleted successfully');
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getStakeHolderDetails = id => {
  return async dispatch => {
    try {
      const response = await DebtorStakeHolderApiServices.StakeHolderCRUD.getStakeHolderDetails(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.STAKE_HOLDER_CRUD.GET_STAKE_HOLDER_DETAILS,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
