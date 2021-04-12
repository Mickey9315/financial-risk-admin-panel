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

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
