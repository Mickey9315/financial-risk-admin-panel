import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { CLAIMS_REDUX_CONSTANTS } from './ClaimsReduxConstants';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { errorNotification, successNotification } from '../../../common/Toast';
import { ClaimsApiServices } from '../services/ClaimsApiService';
import { DashboardApiService } from '../../Dashboard/services/DashboardApiService';

export const getClaimsListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    const finalParams = {
      ...params,
      clientId: params?.clientId?.value,
    };
    try {
      startGeneralLoaderOnRequest('claimListLoader');
      const response = await ClaimsApiServices.getClaimsListByFilter(finalParams);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_SUCCESS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('claimListLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('claimListLoader');
      displayErrors(e);
    }
  };
};

export const getClaimsColumnsList = () => {
  const param = {
    columnFor: 'claim',
  };
  return async dispatch => {
    try {
      const response = await ClaimsApiServices.getClaimsColumnList(param);
      dispatch({
        type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_COLUMNS_LIST,
        data: response?.data?.data,
      });
      dispatch({
        type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_DEFAULT_COLUMN_LIST,
        data: response?.data?.data,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const changeClaimsColumnList = data => {
  return async dispatch => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.UPDATE_CLAIMS_COLUMNS_LIST,
      data,
    });
  };
};

export const saveClaimsColumnsList = ({ claimsColumnList = {}, isReset = false }) => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest(
        `claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      let data = {
        isReset: true,
        columns: [],
        columnFor: 'claim',
      };
      if (!isReset) {
        const defaultFields = claimsColumnList.defaultFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        const customFields = claimsColumnList.customFields
          .filter(field => field.isChecked)
          .map(field => field.name);
        data = {
          isReset: false,
          columns: [...defaultFields, ...customFields],
          columnFor: 'claim',
        };
        if (data.columns.length < 1) {
          errorNotification('Please select at least one column to continue.');
          stopGeneralLoaderOnSuccessOrFail(
            `claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await ClaimsApiServices.updateClaimsColumnList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_DEFAULT_COLUMN_LIST,
          data: claimsColumnList,
        });
        successNotification('Columns updated successfully');
        stopGeneralLoaderOnSuccessOrFail(
          `claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail(
        `claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
      );
      displayErrors(e);
      throw Error();
    }
  };
};

export const getClaimsEntityList = () => {
  return async dispatch => {
    try {
      const response = await ClaimsApiServices.getClaimsEntityList();

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_ENTITY_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const handleClaimChange = (name, value) => {
  return dispatch => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.ADD_CLAIMS_VALUE_CHANGE,
      name,
      value,
    });
  };
};

export const getClaimDetails = id => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('viewClaimLoader');
      const response = await ClaimsApiServices.getClaimDetails(id);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIM_DETAILS,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('viewClaimLoader');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewClaimLoader');
      displayErrors(e);
    }
  };
};

export const addClaim = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('saveClaimsButtonLoaderAction');
      const response = await ClaimsApiServices.addClaim(data);

      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Claim added successfully');
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.RESET_CLAIMS_DETAILS,
        });
        stopGeneralLoaderOnSuccessOrFail('saveClaimsButtonLoaderAction');
        return response?.data?.claimId;
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('saveClaimsButtonLoaderAction');
      displayErrors(e);
      return false;
    }
    return false;
  };
};

export const resetClaimListData = () => {
  return dispatch => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.RESET_CLAIM_LIST_DATA,
    });
  };
};

export const resetClaimDetails = () => {
  return async dispatch => {
    dispatch({
      type: CLAIMS_REDUX_CONSTANTS.RESET_CLAIMS_DETAILS,
    });
  };
};

// Document Actions

export const getClaimsDocumentsListData = (id, params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await ClaimsApiServices.ClaimsDocumentServices.getClaimsDocumentsList(
        id,
        params
      );

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.DOCUMENTS.FETCH_CLAIMS_DOCUMENTS_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const uploadClaimDocument = (data, config) => {
  return async () => {
    try {
      startGeneralLoaderOnRequest('viewClaimUploadDocumentButtonLoaderAction');
      const response = await ClaimsApiServices.ClaimsDocumentServices.uploadClaimDocument(
        data,
        config
      );
      if (response?.data?.status === 'SUCCESS') {
        stopGeneralLoaderOnSuccessOrFail('viewClaimUploadDocumentButtonLoaderAction');
        successNotification(response.data.message || 'Document uploaded successfully');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('viewClaimUploadDocumentButtonLoaderAction');
      displayErrors(e);
    }
  };
};

export const downloadDocumentFromServer = async id => {
  try {
    startGeneralLoaderOnRequest('viewClaimDownloadDocumentButtonLoaderAction');
    const response = await ClaimsApiServices.ClaimsDocumentServices.downloadClaimDocument(id);
    if (response?.statusText === 'OK') {
      stopGeneralLoaderOnSuccessOrFail('viewClaimDownloadDocumentButtonLoaderAction');
      return response;
    }
  } catch (e) {
    stopGeneralLoaderOnSuccessOrFail('viewClaimDownloadDocumentButtonLoaderAction');
    displayErrors(e);
  }
  return false;
};

export const getClaimsFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch({
        ...options,
        isForRisk: true,
      });

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_ENTITY_LIST_BY_SEARCH,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getCliamsManagerListAction = () => {
  return async dispatch => {
    try {
      const response = await ClaimsApiServices.getClaimsManagerList();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_MANAGER_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
