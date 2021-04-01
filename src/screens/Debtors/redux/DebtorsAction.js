import { errorNotification, successNotification } from '../../../common/Toast';
import DebtorsApiServices from '../services/DebtorsApiServices';
import {
  DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  DEBTORS_REDUX_CONSTANTS,
} from './DebtorsReduxConstants';

export const getDebtorsList = (params = { page: 1, limit: 15 }) => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getAllDebtorsList(params);
      if (response.data.status === 'SUCCESS') {
        dispatch({
          type: DEBTORS_REDUX_CONSTANTS.DEBTORS_LIST_USER_ACTION,
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

export const getDebtorsColumnNameList = () => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.getDebtorsColumnNameList();

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
        };
      }
      if (!isReset && data.columns.length < 1) {
        errorNotification('Please select at least one column to continue.');
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

export const changeDebtorData = data => {
  return async dispatch => {
    dispatch({
      type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION,
      data,
    });
  };
};

export const changeDebtorAddressData = data => {
  return async dispatch => {
    dispatch({
      type: DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ADDRESS_ACTION,
      data,
    });
  };
};

export const updateDebtorData = (id, data) => {
  return async dispatch => {
    try {
      const response = await DebtorsApiServices.updateDebtorDetailById(id, data);
      if (response.data.status === 'SUCCESS') {
        successNotification('Debtor details updated successfully');
        dispatch(getDebtorById(id));
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
