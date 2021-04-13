import { SETTING_REDUX_CONSTANTS } from './SettingReduxConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';

const initialSettingState = {
  documentType: {
    docs: [],
    total: 0,
    limit: 0,
    page: 1,
    pages: 1,
    headers: [],
    isLoading: true,
    error: null,
  },
  addDocumentType: [],
  organizationDetails: {
    isLoading: true,
    error: null,
  },
  apiIntegration: {
    isLoading: true,
    error: null,
  },
  auditLogList: {
    docs: [],
    total: 0,
    limit: 0,
    page: 1,
    pages: 1,
    headers: [],
    isLoading: true,
    error: null,
  },
};

export const settingReducer = (state = initialSettingState, action) => {
  switch (action.type) {
    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_REQUEST:
      return {
        ...state,
        documentType: {
          ...state.documentType,
          isLoading: true,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_SUCCESS:
      return {
        ...state,
        documentType: {
          ...action.data,
          isLoading: false,
          error: null,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_FAILURE:
      return {
        ...state,
        documentType: {
          ...action.data,
          isLoading: false,
          error: action.error,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.RESET_PAGE_DATA:
      return {
        ...state,
        documentType: {
          ...state.documentType,
          page: 1,
          limit: 15,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.ADD_DOCUMENT_TYPE.UPDATE_DOCUMENT_TYPE_FIELDS:
      return {
        ...state,
        addDocumentType: {
          ...state.addDocumentType,
          [`${action.name}`]: action.value,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.ADD_DOCUMENT_TYPE.RESET_ADD_DOC_TYPE_DATA:
      return {
        ...state,
        addDocumentType: [],
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.EDIT_DOCUMENT_TYPE.GET_DOCTYPE_DETAIL:
      return {
        ...state,
        addDocumentType: action.data,
      };

    case SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.FETCH_ORGANIZATION_DETAILS_SUCCESS:
      return {
        ...state,
        organizationDetails: {
          ...action.data,
          isLoading: false,
        },
      };

    case SETTING_REDUX_CONSTANTS.API_INTEGRATION.FETCH_API_INTEGRATION_SUCCESS:
      return {
        ...state,
        apiIntegration: {
          ...action.data,
          isLoading: false,
        },
      };

    case SETTING_REDUX_CONSTANTS.AUDIT_LOG.FETCH_AUDIT_LOG_LIST_SUCCESS:
      return {
        ...state,
        auditLogList: {
          ...action.data,
          isLoading: false,
          error: null,
        },
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
