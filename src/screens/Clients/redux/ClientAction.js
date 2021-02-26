import { errorNotification, successNotification } from '../../../common/Toast';
import ClientApiService from '../services/ClientApiService';
import ClientContactApiService from '../services/ClientContactApiService';
import {
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS,
  CLIENT_REDUX_CONSTANTS,
} from './ClientReduxConstants';
import ClientPoliciesApiService from '../services/ClientPoliciesApiService';

export const getClientList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await ClientApiService.getAllClientList(params);
      console.log('response of getClientList', response);
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
