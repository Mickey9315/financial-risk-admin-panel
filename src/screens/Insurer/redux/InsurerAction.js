import { errorNotification, successNotification } from '../../../common/Toast';
import InsurerApiService from '../services/InsurerApiService';
import {
  INSURER_COLUMN_LIST_REDUX_CONSTANTS,
  INSURER_CRM_REDUX_CONSTANTS,
  INSURER_REDUX_CONSTANTS,
  INSURER_VIEW_REDUX_CONSTANT,
} from './InsurerReduxConstants';
import InsurerContactApiServices from '../services/InsurerContactApiServices';
import InsurerPoliciesApiServices from '../services/InsurerPoliciesApiServices';
import InsurerMatrixApiServices from '../services/InsurerMatrixApiServices';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { store } from '../../../redux/store';

export const getInsurerListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('insurerListLoader');
      const response = await InsurerApiService.getAllInsurerListData(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: INSURER_REDUX_CONSTANTS.INSURER_LIST_USER_SUCCESS_ACTION,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('insurerListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('insurerListLoader');
      displayErrors(e);
    }
  };
};

export const getInsurerColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await InsurerApiService.getInsurerColumnListName();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_DEFAULT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeInsurerColumnListStatus = data => {
  return async dispatch => {
    dispatch({
      type: INSURER_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_INSURER_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveInsurerColumnListName = ({ insurerColumnNameList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `insurerListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
      };
      if (!isReset) {
        const defaultFields = insurerColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = insurerColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `insurerListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await InsurerApiService.updateInsurerColumnListName(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_DEFAULT_COLUMN_LIST_ACTION,
          data: insurerColumnNameList,
        });
        successNotification(response?.data?.message || 'Columns updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(
          `insurerListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `insurerListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const getInsurerById = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewInsurerPageLoaderAction');
      const response = await InsurerApiService.getSelectedInsurerData(id);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.VIEW_INSURER_DATA,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewInsurerPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewInsurerPageLoaderAction');
      displayErrors(e);
    }
  };
};

export const getInsurerContactListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await InsurerContactApiServices.getInsurerContactList(id, params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_LIST_USER_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getInsurerContactColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await InsurerContactApiServices.getInsurerContactColumnListName();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_DEFAULT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeInsurerContactColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.CONTACT.UPDATE_INSURER_CONTACT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveInsurerContactColumnNameList = ({
  insurerContactColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `viewInsurerContactColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
      };
      if (!isReset) {
        const defaultFields = insurerContactColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = insurerContactColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `viewInsurerContactColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }

      const response = await InsurerContactApiServices.updateInsurerContactColumnNameList(data);

      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully');
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_DEFAULT_COLUMN_LIST_ACTION,
          data: insurerContactColumnNameList,
        });
        stopGeneralLoaderOnSuccessOrFail(
          `viewInsurerContactColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `viewInsurerContactColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

export const syncInsurerContactListData = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewInsurerSyncInsurerContactButtonLoaderAction`);
      const response = await InsurerContactApiServices.syncInsurerContactList(id);
      if (response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Insurer contact updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewInsurerSyncInsurerContactButtonLoaderAction`);
        dispatch(getInsurerContactListData(id));
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewInsurerSyncInsurerContactButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getInsurerPoliciesListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const updatedParams = {
        ...params,
        listFor: 'insurer-policy',
      };

      const response = await InsurerPoliciesApiServices.getInsurerPoliciesList(id, updatedParams);

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_LIST_USER_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getInsurerPoliciesColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await InsurerPoliciesApiServices.getInsurerPoliciesColumnListName();
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_DEFAULT_COLUMN_LIST_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeInsurerPoliciesColumnListStatus = data => {
  return dispatch => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.UPDATE_POLICIES_CONTACT_COLUMN_LIST_ACTION,
      data,
    });
  };
};

export const saveInsurerPoliciesColumnNameList = ({
  insurerPoliciesColumnNameList = {},
  isReset = false,
}) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `viewInsurerPoliciesColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'insurer-policy',
      };

      if (!isReset) {
        const defaultColumns = insurerPoliciesColumnNameList.defaultFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        const customFields = insurerPoliciesColumnNameList.customFields
          .filter(e => e.isChecked)
          .map(e => e.name);
        data = {
          ...data,
          isReset: false,
          columns: [...defaultColumns, ...customFields],
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `viewInsurerPoliciesColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }

      const response = await InsurerPoliciesApiServices.updateInsurerPoliciesColumnListName(data);

      if (response && response.data && response.data.status === 'SUCCESS') {
        successNotification(response?.data?.message || 'Columns updated successfully.');
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_DEFAULT_COLUMN_LIST_ACTION,
          data: insurerPoliciesColumnNameList,
        });
        stopGeneralLoaderOnSuccessOrFail(
          `viewInsurerPoliciesColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `viewInsurerPoliciesColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
    }
  };
};

/*
 *Add insurer using CRM
 */

export const getListFromCrm = data => {
  return async dispatch => {
    try {
      const response = await InsurerApiService.getListFromCRM(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: INSURER_CRM_REDUX_CONSTANTS.INSURER_GET_LIST_FROM_CRM_ACTION,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const syncInsurerData = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(`viewInsurerSyncInsurerDataButtonLoaderAction`);
      const response = await InsurerApiService.syncInsurerDataWithCrm(id);

      if (response.data.status === 'SUCCESS') {
        dispatch(getInsurerById(id));
        successNotification(response?.data?.message || 'Insurer data updated successfully.');
        stopGeneralLoaderOnSuccessOrFail(`viewInsurerSyncInsurerDataButtonLoaderAction`);
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(`viewInsurerSyncInsurerDataButtonLoaderAction`);
      displayErrors(e);
    }
  };
};

export const getInsurerMatrixData = id => {
  return async dispatch => {
    try {
      const response = await InsurerMatrixApiServices.getInsurerMatrixData(id);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.MATRIX.INSURER_MATRIX_GET_DATA,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getPolicySyncListForCRM = (id, data) => {
  return async dispatch => {
    try {
      const response = await InsurerPoliciesApiServices.getPolicySyncListBySearch(id, data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICY_SYNC_LIST_BY_SEARCH,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const resetInsurerListPaginationData = (page, pages, total, limit) => {
  return async dispatch => {
    dispatch({
      type: INSURER_REDUX_CONSTANTS.RESET_INSURER_LIST_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const setViewInsurerActiveTabIndex = index => {
  store.dispatch({
    type: INSURER_VIEW_REDUX_CONSTANT.VIEW_INSURER_ACTIVE_TAB_INDEX,
    index,
  });
};

export const resetInsurerListData = () => {
  return dispatch => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.RESET_INSURER_LIST_DATA,
    });
  };
};
export const resetInsurerViewData = () => {
  return dispatch => {
    dispatch({
      type: INSURER_VIEW_REDUX_CONSTANT.RESET_VIEW_INSURER_DATA,
    });
  };
};
