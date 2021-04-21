import {
  DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  DEBTORS_REDUX_CONSTANTS,
} from './DebtorsReduxConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';

const initialDebtorState = {
  debtorsList: { docs: [], total: 0, limit: 0, page: 1, pages: 1, isLoading: true, error: null },
  notes: {
    notesList: { docs: [], total: 0, limit: 0, page: 1, pages: 1, isLoading: true, error: null },
  },
  debtorsColumnNameList: {},
  selectedDebtorData: {},
  dropdownData: {
    streetType: [],
    australianStates: [],
    entityType: [],
  },
  documents: {
    documentsList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    documentTypeList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    uploadDocumentData: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  task: {
    taskList: { docs: [], total: 0, limit: 0, page: 1, pages: 1, isLoading: true, error: null },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    addTask: {
      title: '',
      description: '',
      priority: [],
      entityType: [],
      entityId: [],
      assigneeId: [],
      dueDate: '',
      taskFrom: 'debtor-task',
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
      defaultEntityList: [],
    },
  },
  application: {
    applicationList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  creditLimit: {
    creditLimitList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  stakeHolder: {
    stakeHolderList: {
      docs: [],
      total: 0,
      limit: 0,
      page: 1,
      pages: 1,
      isLoading: true,
      error: null,
    },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
};

export const debtorsManagement = (state = initialDebtorState, action) => {
  switch (action.type) {
    case DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_SUCCESS:
      return {
        ...state,
        debtorsList: { ...state.debtorsList, ...action.data, isLoading: false, error: null },
      };
    case DEBTORS_REDUX_CONSTANTS.FETCH_DEBTOR_LIST_FAILURE:
      return {
        ...state,
        debtorsList: { ...state.clientList, isLoading: false, error: action.error },
      };
    case DEBTORS_REDUX_CONSTANTS.DEBTORS_LIST_USER_ACTION:
      return {
        ...state,
        debtorsList: action.data,
      };
    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION:
      return {
        ...state,
        debtorsColumnNameList: action.data,
      };
    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION:
      // eslint-disable-next-line no-case-declarations
      const temp = {
        ...state.debtorsColumnNameList,
      };
      // eslint-disable-next-line no-case-declarations
      const { name, type, value } = action.data;
      temp[`${type}`] = temp[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        debtorsColumnNameList: temp,
      };
    case DEBTORS_REDUX_CONSTANTS.DEBTOR_LIST_RESET_PAGE_DATA:
      return {
        ...state,
        debtorsList: {
          ...state.debtorsList,
          page: 1,
          limit: 15,
        },
      };
    case DEBTORS_REDUX_CONSTANTS.SELECTED_DEBTORS_DATA:
      return {
        ...state,
        selectedDebtorData: action.data,
      };
    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS: {
      const dropdownData = {};
      // eslint-disable-next-line no-shadow
      Object.entries(action.data).forEach(([key, value]) => {
        dropdownData[key] = value.map(entity => ({
          label: entity.name,
          name: key,
          value: entity._id,
        }));
      });
      return {
        ...state,
        dropdownData,
      };
    }
    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION:
      return {
        ...state,
        selectedDebtorData: {
          ...state.selectedDebtorData,
          [`${action.name}`]: action.value,
        },
      };

    // DEBTORS NOTES

    case DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_SUCCESS:
      return {
        ...state,
        notes: {
          ...state.notes,
          notesList: {
            ...state.notes.notesList,
            ...action.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.NOTES.FETCH_DEBTOR_NOTES_LIST_FAILURE:
      return {
        ...state,
        notes: {
          ...state.notes,
          notesList: {
            ...state.notes.notesList,
            isLoading: false,
            error: action.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.NOTES.DEBTORS_NOTES_LIST_USER_ACTION:
      return {
        ...state,
        notes: {
          ...state.notes,
          notesList: action.data,
        },
      };

    /** documents section */

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_SUCCESS:
      return {
        ...state,
        documents: {
          ...state.documents,
          documentsList: {
            ...state.documents.documentsList,
            ...action.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.FETCH_DEBTOR_DOCUMENTS_LIST_FAILURE:
      return {
        ...state,
        documents: {
          ...state.documents,
          documentsList: {
            ...state.documents.documentsList,
            isLoading: false,
            error: action.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_LIST_USER_ACTION:
      return {
        ...state,
        documents: {
          ...state.documents,
          documentsList: action.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        documents: {
          ...state.documents,
          columnList: action.data,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPDATE_DEBTOR_DOCUMENTS_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.documents.columnList,
      };

      // eslint-disable-next-line no-shadow
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

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.DEBTOR_DOCUMENT_TYPE_LIST_USER_ACTION: {
      return {
        ...state,
        documents: {
          ...state.documents,
          documentTypeList: action.data,
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DEBTOR_ACTION: {
      return {
        ...state,
        documents: {
          ...state.documents,
          uploadDocumentData: action.data,
        },
      };
    }

    // tasks

    case DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_SUCCESS:
      return {
        ...state,
        task: {
          ...state.task,
          taskList: {
            ...state.task.taskList,
            ...action.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.TASK.FETCH_DEBTOR_TASK_LIST_FAILURE:
      return {
        ...state,
        task: {
          ...state.task,
          taskList: {
            ...state.task.taskList,
            isLoading: false,
            error: action.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          taskList: action.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.DEBTOR_TASK_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          columnList: action.data,
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.UPDATE_DEBTOR_TASK_COLUMN_NAME_LIST_ACTION: {
      const columnList = {
        ...state.task.columnList,
      };
      // eslint-disable-next-line no-shadow
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
    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.UPDATE_ADD_TASK_FIELD_ACTION:
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

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.ASSIGNEE_DROP_DOWN_DATA_ACTION: {
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

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action.data.map(data => ({
        label: data.name || data.applicationId,
        value: data._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state.task,
          dropDownData: {
            ...state.task.dropDownData,
            entityList,
          },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.DEFAULT_ENTITY_DROP_DOWN_DATA_ACTION: {
      const defaultEntityList = action.data.map(data => ({
        label: data.name || data.applicationId,
        value: data._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state.task,
          dropDownData: {
            ...state.task.dropDownData,
            defaultEntityList,
          },
        },
      };
    }

    case DEBTORS_REDUX_CONSTANTS.TASK.ADD_TASK.RESET_ADD_TASK_STATE_ACTION:
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
            taskFrom: 'debtor-task',
          },
        },
      };

    case DEBTORS_REDUX_CONSTANTS.TASK.EDIT_TASK.GET_DEBTOR_TASK_DETAILS_ACTION:
      return {
        ...state,
        task: {
          ...state.task,
          addTask: action.data,
        },
      };

    // application

    case DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        application: {
          ...state.application,
          applicationList: {
            ...state.application.applicationList,
            ...action.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.FETCH_DEBTOR_APPLICATION_LIST_FAILURE:
      return {
        ...state,
        application: {
          ...state.application,
          applicationList: {
            ...state.application.applicationList,
            isLoading: false,
            error: action.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state.application,
          applicationList: action.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.DEBTOR_APPLICATION_COLUMN_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state.application,
          columnList: action.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.APPLICATION.UPDATE_DEBTOR_APPLICATION_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.application.columnList,
      };
      // eslint-disable-next-line no-shadow
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

    // creditLimit
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_SUCCESS:
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          creditLimitList: {
            ...state.creditLimit.creditLimitList,
            ...action.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.FETCH_DEBTOR_CREDIT_LIMIT_LIST_FAILURE:
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          creditLimitList: {
            ...state.creditLimit.creditLimitList,
            isLoading: false,
            error: action.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          creditLimitList: action.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state.creditLimit,
          columnList: action.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_DEBTOR_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.creditLimit.columnList,
      };
      // eslint-disable-next-line no-shadow
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
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_SUCCESS:
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
          stakeHolderList: {
            ...state.stakeHolder.stakeHolderList,
            ...action.data,
            isLoading: false,
            error: null,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.FETCH_DEBTOR_STAKE_HOLDER_LIST_FAILURE:
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
          stakeHolderList: {
            ...state.stakeHolder.stakeHolderList,
            isLoading: false,
            error: action.data,
          },
        },
      };
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_LIST_ACTION: {
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
          stakeHolderList: action.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION: {
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
          columnList: action.data,
        },
      };
    }
    case DEBTORS_REDUX_CONSTANTS.STAKE_HOLDER.UPDATE_DEBTOR_STAKE_HOLDER_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.stakeHolder.columnList,
      };
      // eslint-disable-next-line no-shadow
      const { name, type, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        stakeHolder: {
          ...state.stakeHolder,
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
