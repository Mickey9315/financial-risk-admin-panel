import { OVERDUE_REDUX_CONSTANTS } from './OverduesReduxConstants';
import { OverdueApiServices } from '../services/OverdueApiServices';
import { displayErrors } from '../../../helpers/ErrorNotifyHelper';
import { successNotification } from '../../../common/Toast';
import {
  startGeneralLoaderOnRequest,
  stopGeneralLoaderOnSuccessOrFail,
} from '../../../common/GeneralLoader/redux/GeneralLoaderAction';
import { DashboardApiService } from '../../Dashboard/services/DashboardApiService';

export const getEntityDetails = () => {
  return async dispatch => {
    try {
      const response = await OverdueApiServices.getEntityListData();
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.GET_ENTITY_LIST,
          data: response?.data?.data,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const handleOverdueFieldChange = (name, value) => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_FIELD_VALUE,
      name,
      value,
    });
  };
};

export const resetOverdueFormData = () => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA,
    });
  };
};

export const addNewOverdueDetails = data => {
  return dispatch => {
    try {
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_ADD,
        data,
      });
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const getOverdueList = params => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('overdueListPageLoaderAction');
      const response = await OverdueApiServices.getOverdueList(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.GET_OVERDUE_LIST,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('overdueListPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('overdueListPageLoaderAction');
      displayErrors(e);
    }
  };
};
export const getOverdueListByDate = params => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('addOverduePageLoaderAction');
      const response = await OverdueApiServices.getOverdueListByDate(params);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_LIST_BY_DATE,
          data: response?.data?.data,
        });
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.COPY_OVERDUE_LIST_BY_DATE,
          data: response?.data?.data,
        });
        stopGeneralLoaderOnSuccessOrFail('addOverduePageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('addOverduePageLoaderAction');
      displayErrors(e);
    }
  };
};

export const changeOverdueStatus = (id, params) => {
  return async () => {
    try {
      const response = await OverdueApiServices.changeOverdueStatus(id, params);
      if (response?.data?.status === 'SUCCESS') {
        successNotification(response?.data?.message ?? 'Status updated successfully');
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
export const getOverdueDetailsById = id => {
  return dispatch =>
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_DETAILS,
      id,
    });
};

export const changeOverdueAction = (id, status) => {
  return async dispatch => {
    try {
      await dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_DETAILS_ACTION,
        id,
        status,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const amendOverdue = (id, data) => {
  return async dispatch => {
    try {
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_AMEND,
        id,
        data,
      });
      dispatch({
        type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA,
      });
    } catch (e) {
      displayErrors(e);
    }
  };
};

export const saveOverdueList = data => {
  return async dispatch => {
    try {
      startGeneralLoaderOnRequest('saveOverdueToBackEndPageLoaderAction');
      const response = await OverdueApiServices.saveOverdueList(data);
      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_BY_DATE,
          data,
        });
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_COPY_OVERDUE_LIST_BY_DATE,
          data,
        });
        successNotification(response?.data?.message ?? 'Overdue saved successfully');
        stopGeneralLoaderOnSuccessOrFail('saveOverdueToBackEndPageLoaderAction');
      }
    } catch (e) {
      stopGeneralLoaderOnSuccessOrFail('saveOverdueToBackEndPageLoaderAction');
      displayErrors(e);
      throw Error();
    }
  };
};

export const resetOverdueListData = (page, pages, total, limit) => {
  return dispatch => {
    dispatch({
      type: OVERDUE_REDUX_CONSTANTS.RESET_OVERDUE_LIST_PAGINATION_DATA,
      page,
      pages,
      total,
      limit,
    });
  };
};

export const getOverdueFilterDropDownDataBySearch = options => {
  return async dispatch => {
    try {
      const response = await DashboardApiService.getEntitiesBySearch(options);

      if (response?.data?.status === 'SUCCESS') {
        dispatch({
          type: OVERDUE_REDUX_CONSTANTS.GET_OVERDUE_ENTITY_DATA_BY_SEARCH,
          data: response?.data?.data,
          name: options?.entityType,
        });
      }
    } catch (e) {
      displayErrors(e);
    }
  };
};
