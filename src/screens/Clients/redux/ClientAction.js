import { errorNotification, successNotification } from '../../../common/Toast';
import ClientApiService from '../services/ClientApiService';
import ClientContactApiService from '../services/ClientContactApiService';
import {
  CLIENT_ADD_FROM_CRM_REDUX_CONSTANT,
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS,
  CLIENT_REDUX_CONSTANTS,
} from './ClientReduxConstants';
import ClientPoliciesApiService from '../services/ClientPoliciesApiService';
import ClientNotesApiService from '../services/ClientNotesApiService';
import ClientDocumentsApiService from '../services/ClientDocumentsApiService';
import ClientCreditLimitApiService from '../services/ClientCreditLimitApiService';
import ClientApplicationApiService from '../services/ClientApplicationApiService';
import ClientTaskApiService from '../services/ClientTaskApiService';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';

export const getClientList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getAllClientList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.FETCH_CLIENT_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: CLIENT_REDUX_CONSTANTS.FETCH_CLIENT_LIST_FAILURE,
        data: null,
      });
      displayErrors(e);
    }
  };
};

// reseting clientlist pagination
export const resetClientListPaginationData = (page, pages, total, limit) => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.RESET_CLIENT_LIST_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const getClientById = id => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getClientById(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.SELECTED_CLIENT_DATA,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateSelectedClientData = (id, data) => {
  return async () => {
    try {
      const response = await ClientApiService.updateSelectedClientData(id, data);

      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Client details updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClientColumnListName = () => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getClientColumnListName();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type:
            CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// for filter of client list
export const getClientFilter = () => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getClientFilter();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_FILTER_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getListFromCrm = data => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getListFromCrm(data);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_ADD_FROM_CRM_REDUX_CONSTANT.CLIENT_GET_LIST_FROM_CRM_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type:
        CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CLIENT_MANAGEMENT_COLUMN_LIST_ACTION,
      data,
    });
  };
};
export const saveClientColumnListName = ({ clientColumnList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultColumns = clientColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientColumnList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }
      const response = await ClientApiService.updateClientColumnListName(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type:
            CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: clientColumnList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const syncClientData = id => {
  return async dispatch => {
    try {
      const response = await ClientApiService.syncClientData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientById(id));
        successNotification(response?.data?.message || 'Client data updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

/*
 * Contact section
 * */

export const getClientContactListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await ClientContactApiService.getClientContactList(id, params);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const syncClientContactListData = id => {
  return async dispatch => {
    try {
      const response = await ClientContactApiService.syncClientContactData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientContactListData(id));
        successNotification(response?.data?.message || 'Client contact updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClientContactColumnNamesList = () => {
  return async dispatch => {
    try {
      const response = await ClientContactApiService.getClientContactColumnListName();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_LIST_USER_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_DEFAULT_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientContactColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CONTACT.UPDATE_CLIENT_CONTACT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientContactColumnListName = ({
  clientContactColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultColumns = clientContactColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientContactColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }
      const response = await ClientContactApiService.updateClientContactColumnListName(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully.');
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_DEFAULT_LIST_USER_ACTION,
          data: clientContactColumnNameList,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

/*
 * Policies section
 * */

export const getClientPoliciesListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        listFor: 'client-policy',
      };

      const response = await ClientPoliciesApiService.getClientPoliciesList(id, updatedParams);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClientPoliciesColumnNamesList = () => {
  return async dispatch => {
    try {
      const response = await ClientPoliciesApiService.getClientPoliciesColumnListName();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_LIST_USER_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_DEFAULT_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientPoliciesColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.POLICIES.UPDATE_CLIENT_POLICIES_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientPoliciesColumnListName = ({
  clientPoliciesColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'client-policy',
      };

      if (!isReset) {
        const defaultColumns = clientPoliciesColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientPoliciesColumnNameList.customFields
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

      const response = await ClientPoliciesApiService.updateClientPoliciesColumnListName(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully.');
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_DEFAULT_LIST_USER_ACTION,
          data: clientPoliciesColumnNameList,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const syncClientPolicyListData = id => {
  return async dispatch => {
    try {
      const response = await ClientPoliciesApiService.syncClientContactData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientContactListData(id));
        successNotification(response?.data?.message || 'Client policies updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

/*
 * Notes section
 * */

export const getClientNotesListDataAction = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        noteFor: 'client',
      };

      const response = await ClientNotesApiService.getClientNotesList(id, updatedParams);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.NOTES.CLIENT_NOTES_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const addClientNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      const { description, isPublic } = noteData;
      const data = {
        noteFor: 'client',
        entityId,
        isPublic,
        description,
      };

      const response = await ClientNotesApiService.addClientNote(data);

      if (response.data.status === 'SUCCESS') {
        await dispatch(getClientNotesListDataAction(entityId));
        successNotification(response?.data?.message || 'Note added successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const updateClientNoteAction = (entityId, noteData) => {
  return async dispatch => {
    try {
      const { noteId, description, isPublic } = noteData;
      const data = {
        noteFor: 'client',
        entityId,
        isPublic,
        description,
      };

      const response = await ClientNotesApiService.updateClientNote(noteId, data);

      if (response.data.status === 'SUCCESS') {
        await dispatch(getClientNotesListDataAction(entityId));
        successNotification(response?.data?.message || 'Note updated successfully.');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const deleteClientNoteAction = async (noteId, cb) => {
  try {
    const response = await ClientNotesApiService.deleteClientNote(noteId);

    if (response.data.status === 'SUCCESS') {
      successNotification(response?.data?.message || 'Note deleted successfully.');
      console.log('delete note action');
      if (cb) {
        console.log('note callback');
        cb();
      }
    }
  } catch (e) {
    displayErrors(e);
  }
};

/* documents action */

export const getClientDocumentsListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        documentFor: 'client',
      };

      const response = await ClientDocumentsApiService.getClientDocumentsList(id, updatedParams);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_LIST_USER_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClientDocumentsColumnNamesList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'client-document',
      };

      const response = await ClientDocumentsApiService.getClientDocumentsColumnNamesList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type:
            CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientDocumentsColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPDATE_CLIENT_DOCUMENTS_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientDocumentsColumnListName = ({
  clientDocumentsColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'client-document',
      };

      if (!isReset) {
        const defaultColumns = clientDocumentsColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientDocumentsColumnNameList.customFields
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

      const response = await ClientDocumentsApiService.updateClientDocumentColumnListName(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully.');
        dispatch({
          type:
            CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION,
          data: clientDocumentsColumnNameList,
        });
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
        listFor: 'client',
      };

      const response = await ClientDocumentsApiService.getDocumentTypeList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENT_TYPE_LIST_USER_ACTION,
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
      const response = await ClientDocumentsApiService.uploadDocument(data, config);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_CLIENT_ACTION,
          data: response.data.data,
        });
        successNotification(response?.data?.message || 'Document uploaded successfully.');
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

    const response = await ClientDocumentsApiService.downloadDocuments(config);
    if (response.statusText === 'OK') {
      return response;
    }
  } catch (e) {
    displayErrors(e);
  }
  return false;
};

export const deleteClientDocumentAction = async (docId, cb) => {
  try {
    const response = await ClientDocumentsApiService.deleteClientDocument(docId);
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

// creditLimit
export const getClientCreditLimitData = (id, data) => {
  return async dispatch => {
    try {
      const response = await ClientCreditLimitApiService.getClientCreditLimitList(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_LIST_ACTION,
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
      const response = await ClientCreditLimitApiService.getClientCreditLimitColumnNameList();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientCreditLimitColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientCreditLimitColumnNameList = ({
  clientCreditLimitColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
      };
      if (!isReset) {
        const defaultFields = clientCreditLimitColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientCreditLimitColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          throw Error();
        }
      }
      const response = await ClientCreditLimitApiService.updateClientCreditLimitColumnNameList(
        data
      );
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully');
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION,
          data: clientCreditLimitColumnNameList,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getClientApplicationListData = (id, param) => {
  return async dispatch => {
    try {
      const params = {
        ...param,
        listFor: 'client-application',
      };
      const response = await ClientApplicationApiService.getApplicationListData(id, params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClientApplicationColumnNameList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'client-application',
      };
      const response = await ClientApplicationApiService.getClientApplicationColumnNameList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientApplicationColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.APPLICATION.UPDATE_CLIENT_APPLICATION_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientApplicationColumnNameList = ({
  clientApplicationColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'client-application',
      };
      if (!isReset) {
        const defaultFields = clientApplicationColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientApplicationColumnNameList.customFields
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
      const response = await ClientApplicationApiService.updateClientApplicationColumnNameList(
        data
      );
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully');
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_DEFAULT_COLUMN_LIST_ACTION,
          data: clientApplicationColumnNameList,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

// tasks
export const getClientTaskListData = (params, id) => {
  return async dispatch => {
    try {
      const data = {
        ...params,
        requestedEntityId: id,
      };
      const response = await ClientTaskApiService.getClientTaskListData(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClientTaskColumnList = () => {
  return async dispatch => {
    try {
      const params = {
        columnFor: 'client-task',
      };
      const response = await ClientTaskApiService.getClientTaskColumnNameList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_COLUMN_NAME_LIST_ACTION,
          data: response.data.data,
        });
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClientTaskColumnNameListStatus = data => {
  return async dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.TASK.UPDATE_CLIENT_TASK_COLUMN_NAME_LIST_ACTION,
      data,
    });
  };
};

export const saveClientTaskColumnNameListName = ({
  clientTaskColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'client-task',
      };

      if (!isReset) {
        const defaultColumns = clientTaskColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientTaskColumnNameList.customFields
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

      const response = await ClientTaskApiService.updateClientTaskColumnNameList(data);
      if (response && response.data && response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully');
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION,
          data: clientTaskColumnNameList,
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
      const response = await ClientTaskApiService.getAssigneeDropDownData();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_ASSIGNEE_DROP_DOWN_DATA_ACTION,
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
      const response = await ClientTaskApiService.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_ENTITY_DROP_DOWN_DATA_ACTION,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getDefaultEntityDropDownData = params => {
  return async dispatch => {
    try {
      const response = await ClientTaskApiService.getEntityDropDownData(params);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.DEFAULT_CLIENT_ENTITY_DROP_DOWN_DATA_ACTION,
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
      type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_UPDATE_ADD_TASK_FIELD_ACTION,
      name,
      value,
    });
  };
};

export const saveTaskData = (data, cb) => {
  return async dispatch => {
    try {
      const response = await ClientTaskApiService.saveNewTask(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task added successfully');
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
      const response = await ClientTaskApiService.deleteTask();
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

export const getClientTaskDetail = id => {
  return async dispatch => {
    try {
      const response = await ClientTaskApiService.getClientTaskDetailById(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_CLIENT_TASK_DETAILS_ACTION,
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
      const response = await ClientTaskApiService.updateTask(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_RESET_ADD_TASK_STATE_ACTION,
        });
        successNotification(response?.data?.message || 'Task updated successfully');
        cb();
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const resetPageData = () => {
  return async dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.RESET_PAGE_DATA,
    });
  };
};
