import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  CLIENT_ADD_FROM_CRM_REDUX_CONSTANT,
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS,
  CLIENT_REDUX_CONSTANTS,
} from './ClientReduxConstants';

const initialClientListState = {
  clientList: { docs: [], total: 0, limit: 0, page: 1, pages: 1, isLoading: true, error: null },
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
  task: {
    taskList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    addTask: {
      title: '',
      description: '',
      priority: [],
      entityType: [],
      entityId: [],
      assigneeId: [],
      dueDate: '',
      taskFrom: 'client-task',
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
    },
  },
};
const initialClientManagementClientListState = {
  riskAnalystList: [],
  serviceManagerList: [],
};

export const clientManagement = (state = initialClientListState, action) => {
  switch (action.type) {
    case CLIENT_REDUX_CONSTANTS.FETCH_CLIENT_LIST_SUCCESS:
      return {
        ...state,
        clientList: { ...state.clientList, ...action.data, isLoading: false, error: null },
      };
    case CLIENT_REDUX_CONSTANTS.FETCH_CLIENT_LIST_FAILURE:
      return {
        ...state,
        clientList: { ...initialClientListState.clientList, isLoading: false, error: action.error },
      };
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

    case CLIENT_REDUX_CONSTANTS.RESET_PAGE_DATA: {
      return {
        ...state,
        clientList: {
          ...state.clientList,
          page: 1,
          limit: 15,
        },
      };
    }

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
    // tasks
    case CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          taskList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          columnList: action.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.UPDATE_CLIENT_TASK_COLUMN_NAME_LIST_ACTION: {
      const columnList = {
        ...state.task.columnList,
      };
      const { name, type, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        task: {
          ...state.task,
          columnList,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.UPDATE_ADD_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          addTask: {
            ...state.task.addTask,
            [action.name]: action.value,
          },
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action.data.map(data => ({
        label: data.name,
        value: data._id,
        name: 'assigneeId',
      }));
      return {
        ...state,
        task: {
          ...state.task,
          dropDownData: {
            ...state.task.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.ENTITY_DROP_DOWN_DATA_ACTION: {
      // TODO application id change to id
      const entityList = action.data.map(data => ({
        label: data._id || data.name,
        value: data._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state.task,
          addTask: {
            ...state.task.addTask,
            entityId: [],
          },
          dropDownData: {
            ...state.task.dropDownData,
            entityList,
          },
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.RESET_ADD_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          addTask: {
            title: '',
            description: '',
            priority: [],
            entityType: [],
            entityId: [],
            assigneeId: [],
            dueDate: '',
            taskFrom: 'client-task',
          },
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_CLIENT_TASK_DETAILS_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          addTask: action.data,
        },
      };

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
