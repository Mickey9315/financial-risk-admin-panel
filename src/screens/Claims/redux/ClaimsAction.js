import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { CLAIMS_REDUX_CONSTANTS } from './ClaimsReduxConstants';
import {
  startLoaderButtonOnRequest,
  stopLoaderButtonOnSuccessOrFail,
} from '../../../common/LoaderButton/redux/LoaderButtonAction';
import { errorNotification, successNotification } from '../../../common/Toast';
import { ClaimsApiServices } from '../services/ClaimsApiService';

export const getClaimsListByFilter = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      dispatch({
        type: CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_REQUEST,
      });
      const response = await ClaimsApiServices.getClaimsListByFilter(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_SUCCESS,
          data: response.data.data,
        });
      }
    } catch (e) {
      dispatch({
        type: CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_FAILURE,
      });
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
        data: response.data.data,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getClaimsDefaultColumnsList = () => {
  const param = {
    columnFor: 'claim',
  };
  return async dispatch => {
    try {
      const response = await ClaimsApiServices.getClaimsColumnList(param);
      dispatch({
        type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_DEFAULT_COLUMN_LIST,
        data: response.data.data,
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
      startLoaderButtonOnRequest(`claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`);
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
          stopLoaderButtonOnSuccessOrFail(
            `claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
          );
          throw Error();
        }
      }
      const response = await ClaimsApiServices.updateClaimsColumnList(data);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_DEFAULT_COLUMN_LIST,
          data: claimsColumnList,
        });
        successNotification('Columns updated successfully');
        stopLoaderButtonOnSuccessOrFail(
          `claimsListColumn${isReset ? 'Reset' : 'Save'}ButtonLoaderAction`
        );
      }
    } catch (e) {
      stopLoaderButtonOnSuccessOrFail(
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

      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_ENTITY_LIST,
          data: response.data.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
