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
    integration: {
      rss: {
        accessToken: '',
      },
      abn: {
        guid: '',
      },
      illion: {
        password: '',
        subscriberId: '',
        userId: '',
      },
      equifax: {
        username: '',
        password: '',
      },
    },
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
  userNameList: [],
  auditLogColumnNameList: {},
};

export const settingReducer = (state = initialSettingState, action) => {
  switch (action.type) {
    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_REQUEST:
      return {
        ...state,
        documentType: {
          ...state?.documentType,
          isLoading: true,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_SUCCESS:
      return {
        ...state,
        documentType: {
          ...action?.data,
          isLoading: false,
          error: null,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.FETCH_DOCUMENT_TYPE_LIST_FAILURE:
      return {
        ...state,
        documentType: {
          ...state?.documentType,
          isLoading: false,
          error: action?.error,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.RESET_PAGE_DATA:
      return {
        ...state,
        documentType: {
          ...state?.documentType,
          page: 1,
          limit: 15,
        },
      };

    case SETTING_REDUX_CONSTANTS.DOCUMENT_TYPE.ADD_DOCUMENT_TYPE.UPDATE_DOCUMENT_TYPE_FIELDS:
      return {
        ...state,
        addDocumentType: {
          ...state?.addDocumentType,
          [`${action?.name}`]: action?.value,
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
        addDocumentType: action?.data,
      };

    case SETTING_REDUX_CONSTANTS.API_INTEGRATION.FETCH_API_INTEGRATION_SUCCESS:
      return {
        ...state,
        apiIntegration: {
          ...state?.apiIntegration,
          integration: {
            ...state?.apiIntegration?.integration,
            ...action?.data,
          },
          isLoading: false,
        },
      };

    case SETTING_REDUX_CONSTANTS.API_INTEGRATION.EDIT_API_INTEGRATION.CHANGE_API_INTEGRATION_DATA:
    case SETTING_REDUX_CONSTANTS.API_INTEGRATION.EDIT_API_INTEGRATION.UPDATE_API_INTEGRATION_DATA:
      return {
        ...state,
        apiIntegration: {
          ...state?.apiIntegration,
          integration: {
            ...state?.apiIntegration?.integration,
            [action?.data?.apiName]: {
              ...state?.apiIntegration?.integration[action?.data?.apiName],
              [action?.data?.name]: action?.data?.value,
            },
          },
        },
      };

    case SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.FETCH_ORGANIZATION_DETAILS_SUCCESS:
      return {
        ...state,
        organizationDetails: {
          ...state?.organizationDetails,
          ...action?.data,
          isLoading: false,
        },
      };

    case SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.EDIT_ORGANIZATION_DETAILS
      .CHANGE_ORGANIZATION_DETAILS:
    case SETTING_REDUX_CONSTANTS.ORGANIZATION_DETAILS.EDIT_ORGANIZATION_DETAILS
      .UPDATE_ORGANIZATION_DETAILS:
      return {
        ...state,
        organizationDetails: {
          ...state?.organizationDetails,
          [action?.data?.name]: action?.data?.value,
          isLoading: false,
        },
      };

    case SETTING_REDUX_CONSTANTS.AUDIT_LOG.FETCH_AUDIT_LOG_LIST_SUCCESS:
      return {
        ...state,
        auditLogList: {
          ...action?.data,
          isLoading: false,
          error: null,
        },
      };

    case SETTING_REDUX_CONSTANTS.AUDIT_LOG.AUDIT_LOG_COLUMN_LIST_ACTION:
      return {
        ...state,
        auditLogColumnNameList: {
          ...action?.data,
        },
      };

    case SETTING_REDUX_CONSTANTS.AUDIT_LOG.UPDATE_AUDIT_LOG_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.auditLogColumnNameList,
      };

      const { type, name, value } = action?.data ?? {};

      columnList[`${type}`] = columnList[`${type}`]?.map(e =>
        e?.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        auditLogColumnNameList: {
          ...columnList,
        },
      };
    }

    case SETTING_REDUX_CONSTANTS.AUDIT_LOG.GET_AUDIT_USER_TYPE_LIST_DATA:
      return {
        ...state,
        userNameList: [{ ...state?.userNameList }, ...action?.data],
      };

    case SETTING_REDUX_CONSTANTS.AUDIT_LOG.RESET_AUDIT_LOG_LIST_DATA:
      return {
        ...state,
        auditLogList: {
          page: 1,
          limit: 15,
        },
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
