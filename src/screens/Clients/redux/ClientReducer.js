import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CLIENT_ADD_FROM_CRM_REDUX_CONSTANT,
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS,
  CLIENT_REDUX_CONSTANTS,
} from './ClientReduxConstants';

const initialClientListState = {
  clientList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  selectedClient: null,
  creditLimit: {
    creditLimitList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  application: {
    applicationList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  contact: {
    contactList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  policies: {
    policiesList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  notes: {
    notesList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  documents: {
    documentsList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    documentTypeList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    uploadDocumentData: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
};
const initialClientManagementClientListState = {
  riskAnalystList: [],
  serviceManagerList: [],
};

export const clientManagement = (state = initialClientListState, action) => {
  switch (action.type) {
    case CLIENT_REDUX_CONSTANTS.CLIENT_LIST_USER_ACTION:
      return {
        ...state,
        clientList: action.data,
      };

    case CLIENT_REDUX_CONSTANTS.SELECTED_CLIENT_DATA:
      return {
        ...state,
        selectedClient: action.data,
      };

    /*
     *  Contact section
     * */

    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state.contact,
          contactList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state.contact,
          columnList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.UPDATE_CLIENT_CONTACT_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.contact.columnList,
      };

      const { type, name, value } = action.data;

      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        contact: {
          ...state.contact,
          columnList,
        },
      };
    }

    /*
     *  Policies section
     * */

    case CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_LIST_USER_ACTION:
      return {
        ...state,
        policies: {
          ...state.policies,
          policiesList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_LIST_USER_ACTION:
      return {
        ...state,
        policies: {
          ...state.policies,
          columnList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.POLICIES.UPDATE_CLIENT_POLICIES_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.policies.columnList,
      };

      const { type, name, value } = action.data;

      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        policies: {
          ...state.policies,
          columnList,
        },
      };
    }

    /*
     *  Notes section
     * */

    case CLIENT_REDUX_CONSTANTS.NOTES.CLIENT_NOTES_LIST_USER_ACTION:
      return {
        ...state,
        notes: {
          ...state.notes,
          notesList: action.data,
        },
      };

    /** documents section */
    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_LIST_USER_ACTION:
      return {
        ...state,
        documents: {
          ...state.documents,
          documentsList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        documents: {
          ...state.documents,
          columnList: action.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPDATE_CLIENT_DOCUMENTS_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.documents.columnList,
      };

      const { type, name, value } = action.data;

      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        documents: {
          ...state.documents,
          columnList,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENT_TYPE_LIST_USER_ACTION: {
      return {
        ...state,
        documents: {
          ...state.documents,
          documentTypeList: action.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_CLIENT_ACTION: {
      return {
        ...state,
        documents: {
          ...state.documents,
          uploadDocumentData: action.data,
        },
      };
    }

    // creditLimit
    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          creditLimitList: action.data,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          columnList: action.data,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.creditLimit.columnList,
      };
      const { type, name, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          columnList,
        },
      };
    }

    // application
    case CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state.application,
          applicationList: action.data,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_COLUMN_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state.application,
          columnList: action.data,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.APPLICATION.UPDATE_CLIENT_APPLICATION_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.application.columnList,
      };
      const { name, type, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        application: {
          ...state.application,
          columnList,
        },
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};

export const clientManagementColumnList = (state = [], action) => {
  switch (action.type) {
    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_COLUMN_LIST_ACTION:
      return action.data;
    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CLIENT_MANAGEMENT_COLUMN_LIST_ACTION:
      // eslint-disable-next-line no-case-declarations
      const temp = {
        ...state,
      };

      // eslint-disable-next-line no-case-declarations
      const { type, name, value } = action.data;

      temp[`${type}`] = temp[`${type}`].map(e =>
        e.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );

      return temp;

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
export const clientManagementFilterList = (
  state = initialClientManagementClientListState,
  action
) => {
  switch (action.type) {
    case CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_FILTER_LIST_ACTION:
      return action.data;
    default:
      return state;
  }
};
export const syncClientWithCrm = (state = [], action) => {
  switch (action.type) {
    case CLIENT_ADD_FROM_CRM_REDUX_CONSTANT.CLIENT_GET_LIST_FROM_CRM_ACTION:
      return action.data;
    default:
      return state;
  }
};
