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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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

export const saveDebtorsColumnListName = ({ debtorsColumnNameListData = {}, isReset = false }) => {
  return async dispatch => {
    try {
      let data = {
        columns: [],
        isReset: true,
        columnFor: 'debtor',
      };
      if (!isReset) {
        const defaultFields = debtorsColumnNameListData.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsColumnNameListData.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          columns: [...defaultFields, ...customFields],
          isReset: false,
          columnFor: 'debtor',
        };
      }
      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getDebtorsColumnNameList());
      } else {
        const response = await DebtorsApiServices.updateDebtorsColumnNameList(data);
        if (response && response.data && response.data.status === 'SUCCESS') {
          dispatch(getDebtorsList());
          successNotification('Columns updated successfully.');
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const resetPageData = () => {
  return async dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.DEBTOR_LIST_RESET_PAGE_DATA,
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
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
  console.log('actionOnChange', value);
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
        successNotification('Debtor details updated successfully');
        dispatch(getDebtorById(id));
        cb();
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
        successNotification('Note added successfully.');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
        successNotification('Note updated successfully.');
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const deleteDebtorsNoteAction = async (noteId, cb) => {
  try {
    const response = await DebtorsNotesApiService.deleteDebtorsNote(noteId);

    if (response.data.status === 'SUCCESS') {
      successNotification('Note deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else {
        errorNotification('Internal server error');
      }
    }
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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
  debtorsDocumentsColumnList = {},
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
        const defaultColumns = debtorsDocumentsColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorsDocumentsColumnList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
      }

      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getDebtorDocumentsColumnNamesList());
      } else {
        const response = await DebtorsDocumentApiServices.updateDebtorDocumentColumnListName(data);

        dispatch(getDebtorDocumentsColumnNamesList());

        if (response && response.data && response.data.status === 'SUCCESS') {
          successNotification('Columns updated successfully.');
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else {
        errorNotification('Internal server error');
      }
    }
  }
  return false;
};

export const deleteDebtorDocumentAction = async (docId, cb) => {
  try {
    const response = await DebtorsDocumentApiServices.deleteDebtorDocument(docId);
    if (response.data.status === 'SUCCESS') {
      successNotification('Document deleted successfully.');
      if (cb) {
        cb();
      }
    }
  } catch (e) {
    if (e.response && e.response.data) {
      if (e.response.data.status === undefined) {
        errorNotification('It seems like server is down, Please try again later.');
      } else {
        errorNotification('Internal server error');
      }
    }
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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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

export const saveDebtorTaskColumnNameListSelection = ({
  debtorTaskColumnNameListData = {},
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
        const defaultColumns = debtorTaskColumnNameListData.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorTaskColumnNameListData.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
      }

      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getDebtorTaskColumnList());
      } else {
        const response = await DebtorTaskApiService.updateDebtorTaskColumnNameList(data);

        dispatch(getDebtorTaskColumnList());

        if (response && response.data && response.data.status === 'SUCCESS') {
          successNotification('Columns updated successfully.');
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const getAssigneeDropDownData = () => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getAssigneeDropDownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.ASSIGNEE_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const getEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const getDebtorDefaultEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEFAULT_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const updateAddTaskStateFields = (name, value) => {
  return dispatch => {
    dispatch({
      type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.UPDATE_ADD_TASK_FIELD_ACTION,
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
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.RESET_ADD_TASK_STATE_ACTION,
        });
        cb();
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const deleteTaskAction = (taskId, cb) => {
  return async () => {
    try {
      const response = await DebtorTaskApiService.deleteTask();
      if (response.data.status === 'SUCCESS') {
        successNotification('Task deleted successfully.');
        if (cb) {
          cb();
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
    }
  };
};

export const getDebtorTaskDetail = id => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.getDebtorTaskDetailById(id);
      console.log(response);
      if (response.data.status === 'SUCCESS') {
        console.log(response.data.data);
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_DEBTOR_TASK_DETAILS_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};

export const updateTaskData = (id, data, cb) => {
  return async dispatch => {
    try {
      const response = await DebtorTaskApiService.updateTask(id, data);
      if (response.data.status === 'SUCCESS') {
        successNotification(response.data.message);
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.RESET_ADD_TASK_STATE_ACTION,
        });
        cb();
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
  debtorApplicationColumnNameListData = {},
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
        const defaultFields = debtorApplicationColumnNameListData.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorApplicationColumnNameListData.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
      }
      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getDebtorApplicationColumnNameList());
      } else {
        const response = await DebtorApplicationApiServices.updateDebtorApplicationColumnNameList(
          data
        );
        dispatch(getDebtorApplicationColumnNameList());
        if (response.data.status === 'SUCCESS') {
          successNotification(response.data.message);
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
  debtorCreditLimitColumnNameList = {},
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
        const defaultFields = debtorCreditLimitColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorCreditLimitColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'debtor-credit-limit',
        };
      }
      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getCreditLimitColumnsNameList());
      } else {
        const response = await DebtorCreditLimitApiServices.updateDebtorCreditLimitColumnNameList(
          data
        );
        dispatch(getCreditLimitColumnsNameList());
        if (response.data.status === 'SUCCESS') {
          successNotification(response.data.message);
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
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
      if (e.response && e.response.data) {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE,
          data: null,
        });
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else {
          errorNotification('Internal server error');
        }
      }
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
  debtorStakeHolderColumnNameListData = {},
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
        const defaultFields = debtorStakeHolderColumnNameListData.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = debtorStakeHolderColumnNameListData.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
      }
      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
        dispatch(getDebtorStakeHolderColumnNameList());
      } else {
        const response = await DebtorStakeHolderApiServices.updateDebtorStakeHolderColumnNameList(
          data
        );
        dispatch(getDebtorStakeHolderColumnNameList());
        if (response.data.status === 'SUCCESS') {
          successNotification(response.data.message);
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        if (e.response.data.status === undefined) {
          errorNotification('It seems like server is down, Please try again later.');
        } else if (e.response.data.status === 'INTERNAL_SERVER_ERROR') {
          errorNotification('Internal server error');
        } else if (e.response.data.status === 'ERROR') {
          errorNotification('It seems like server is down, Please try again later.');
        }
        throw Error();
      }
    }
  };
};
