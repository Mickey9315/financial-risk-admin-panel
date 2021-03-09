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

export const getClientList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getAllClientList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CLIENT_LIST_USER_ACTION,
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

export const updateSelectedClientData = (id, data) => {
  return async () => {
    try {
      const response = await ClientApiService.updateSelectedClientData(id, data);

      if (response.data.status === 'SUCCESS') {
        successNotification('Client details updated successfully');
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

export const getClientColumnListName = () => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getClientColumnListName();

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_COLUMN_LIST_ACTION,
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
      }

      if (data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
      } else {
        const response = await ClientApiService.updateClientColumnListName(data);
        if (response && response.data && response.data.status === 'SUCCESS') {
          dispatch(getClientList());
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

export const syncClientData = id => {
  return async dispatch => {
    try {
      const response = await ClientApiService.syncClientData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientById(id));
        successNotification('Client data updated successfully.');
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

export const syncClientContactListData = id => {
  return async dispatch => {
    try {
      const response = await ClientContactApiService.syncClientContactData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientContactListData(id));
        successNotification('Client contact updated successfully.');
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

export const getClientContactColumnNamesList = () => {
  return async dispatch => {
    try {
      const response = await ClientContactApiService.getClientContactColumnListName();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_LIST_USER_ACTION,
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

export const changeClientContactColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.CONTACT.UPDATE_CLIENT_CONTACT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientContactColumnListName = ({
  clientContactColumnList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      let data = {
        isReset: true,
        columns: [],
      };

      if (!isReset) {
        const defaultColumns = clientContactColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientContactColumnList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
      }

      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
      } else {
        const response = await ClientContactApiService.updateClientContactColumnListName(data);

        dispatch(getClientContactColumnNamesList());

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

export const getClientPoliciesColumnNamesList = () => {
  return async dispatch => {
    try {
      const response = await ClientPoliciesApiService.getClientPoliciesColumnListName();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_LIST_USER_ACTION,
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

export const changeClientPoliciesColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.POLICIES.UPDATE_CLIENT_POLICIES_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientPoliciesColumnListName = ({
  clientPoliciesColumnList = {},
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
        const defaultColumns = clientPoliciesColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientPoliciesColumnList.customFields
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
      } else {
        const response = await ClientPoliciesApiService.updateClientPoliciesColumnListName(data);

        dispatch(getClientPoliciesColumnNamesList());

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

export const syncClientPolicyListData = id => {
  return async dispatch => {
    try {
      const response = await ClientPoliciesApiService.syncClientContactData(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientContactListData(id));
        successNotification('Client policies updated successfully.');
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

export const deleteClientNoteAction = noteId => {
  return async dispatch => {
    try {
      const response = await ClientNotesApiService.deleteClientNote(noteId);

      if (response.data.status === 'SUCCESS') {
        dispatch(getClientNotesListDataAction());
        successNotification('Note deleted successfully.');
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

export const changeClientDocumentsColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPDATE_CLIENT_DOCUMENTS_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveClientDocumentsColumnListName = ({
  clientDocumentsColumnList = {},
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
        const defaultColumns = clientDocumentsColumnList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = clientDocumentsColumnList.customFields
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
      } else {
        const response = await ClientDocumentsApiService.updateClientDocumentColumnListName(data);

        dispatch(getClientDocumentsColumnNamesList());

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
      const response = await ClientDocumentsApiService.uploadDocument(data, config);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_CLIENT_ACTION,
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

export const downloadDocuments = data => {
  return async dispatch => {
    const str = data.toString();
    try {
      const config = {
        documentIds: str,
      };

      const response = await ClientDocumentsApiService.downloadDocuments(config);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLIENT_REDUX_CONSTANTS.DOCUMENTS.DOWNLOAD_DOCUMENT_CLIENT_ACTION,
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
