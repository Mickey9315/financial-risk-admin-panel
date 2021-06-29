import {
  CLIENT_ADD_FROM_CRM_REDUX_CONSTANT,
  CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  CLIENT_MANAGEMENT_FILTER_LIST_REDUX_CONSTANTS,
  CLIENT_REDUX_CONSTANTS,
} from './ClientReduxConstants';

const initialClientListState = {
  clientList: { docs: [], total: 1, limit: 15, page: 1, pages: 1, isLoading: true, error: null },
  selectedClient: null,
  viewClientActiveTabIndex: 0,
  creditLimit: {
    creditLimitList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    clientCreditLimitColumnNameList: {},
    clientCreditLimitDefaultColumnNameList: {},
  },
  application: {
    applicationList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    clientApplicationColumnNameList: {},
    clientApplicationDefaultColumnNameList: {},
  },
  contact: {
    contactList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    clientContactColumnNameList: {},
    clientContactDefaultColumnNameList: {},
  },
  policies: {
    policiesList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    clientPoliciesColumnNameList: {},
    clientPoliciesDefaultColumnNameList: {},
  },
  notes: {
    notesList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
  },
  documents: {
    documentsList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    clientDocumentsColumnNameList: {},
    clientDocumentsDefaultColumnNameList: {},
    documentTypeList: [],
    uploadDocumentData: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
  },
  task: {
    taskList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    clientTaskColumnNameList: {},
    clientTaskDefaultColumnNameList: {},
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
      defaultEntityList: [],
    },
  },
};
const initialClientManagementClientListState = {
  riskAnalystList: [],
  serviceManagerList: [],
};
const initialClientManagementColumnList = {
  clientColumnList: [],
  clientDefaultColumnList: [],
};

export const clientManagement = (state = initialClientListState, action) => {
  switch (action.type) {
    case CLIENT_REDUX_CONSTANTS.FETCH_CLIENT_LIST_SUCCESS:
      return {
        ...state,
        clientList: { ...state?.clientList, ...action?.data, isLoading: false, error: null },
      };

    case CLIENT_REDUX_CONSTANTS.RESET_CLIENT_LIST_DATA:
      return {
        ...state,
        clientList: initialClientListState.clientList,
      };

    case CLIENT_REDUX_CONSTANTS.CLIENT_LIST_USER_ACTION:
      return {
        ...state,
        clientList: action?.data,
      };

    case CLIENT_REDUX_CONSTANTS.RESET_CLIENT_LIST_PAGINATION_DATA:
      return {
        ...state,
        page: action?.page,
        pages: action?.pages,
        total: action?.total,
        limit: action?.limit,
      };

    case CLIENT_REDUX_CONSTANTS.SELECTED_CLIENT_DATA:
      return {
        ...state,
        selectedClient: action?.data,
      };

    case CLIENT_REDUX_CONSTANTS.RESET_VIEW_CLIENT_DATA:
      return {
        ...state,
        selectedClient: {},
      };

    /*
     *  Contact section
     * */

    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state?.contact,
          contactList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state?.contact,
          clientContactColumnNameList: action?.data,
        },
      };
    case CLIENT_REDUX_CONSTANTS.CONTACT.CLIENT_CONTACT_COLUMN_DEFAULT_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state?.contact,
          clientContactDefaultColumnNameList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.CONTACT.UPDATE_CLIENT_CONTACT_COLUMN_LIST_ACTION: {
      const clientContactColumnNameList = {
        ...state?.contact?.clientContactColumnNameList,
      };

      const { type, name, value } = action?.data ?? {};

      clientContactColumnNameList[`${type}`] = clientContactColumnNameList[`${type}`]?.map(e =>
        e?.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        contact: {
          ...state?.contact,
          clientContactColumnNameList,
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
          ...state?.policies,
          policiesList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_LIST_USER_ACTION:
      return {
        ...state,
        policies: {
          ...state?.policies,
          clientPoliciesColumnNameList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.POLICIES.CLIENT_POLICIES_COLUMN_DEFAULT_LIST_USER_ACTION:
      return {
        ...state,
        policies: {
          ...state?.policies,
          clientPoliciesDefaultColumnNameList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.POLICIES.UPDATE_CLIENT_POLICIES_COLUMN_LIST_ACTION: {
      const clientPoliciesColumnNameList = {
        ...state?.policies?.clientPoliciesColumnNameList,
      };

      const { type, name, value } = action?.data ?? {};

      clientPoliciesColumnNameList[`${type}`] = clientPoliciesColumnNameList[`${type}`]?.map(e =>
        e?.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        policies: {
          ...state?.policies,
          clientPoliciesColumnNameList,
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
          ...state?.notes,
          notesList: action?.data,
        },
      };

    /** documents section */
    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_LIST_USER_ACTION:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentsList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_MANAGEMENT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          clientDocumentsColumnNameList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENTS_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          clientDocumentsDefaultColumnNameList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPDATE_CLIENT_DOCUMENTS_COLUMN_LIST_ACTION: {
      const clientDocumentsColumnNameList = {
        ...state?.documents?.clientDocumentsColumnNameList,
      };

      const { type, name, value } = action?.data ?? {};

      clientDocumentsColumnNameList[`${type}`] = clientDocumentsColumnNameList[`${type}`]?.map(e =>
        e?.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        documents: {
          ...state?.documents,
          clientDocumentsColumnNameList,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.CLIENT_DOCUMENT_TYPE_LIST_USER_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentTypeList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_CLIENT_ACTION: {
      return {
        ...state,
        documents: {
          ...state?.documents,
          uploadDocumentData: action?.data,
        },
      };
    }

    // creditLimit
    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          creditLimitList: action?.data,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          clientCreditLimitColumnNameList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.CLIENT_CREDIT_LIMIT_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          clientCreditLimitDefaultColumnNameList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.CREDIT_LIMIT.UPDATE_CLIENT_CREDIT_LIMIT_COLUMN_LIST_ACTION: {
      const clientCreditLimitColumnNameList = {
        ...state?.creditLimit?.clientCreditLimitColumnNameList,
      };
      const { type, name, value } = action?.data ?? {};
      clientCreditLimitColumnNameList[`${type}`] = clientCreditLimitColumnNameList[
        `${type}`
      ]?.map(e => (e?.name === name ? { ...e, isChecked: value } : e));
      return {
        ...state,
        creditLimit: {
          ...state?.creditLimit,
          clientCreditLimitColumnNameList,
        },
      };
    }

    // application
    case CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state?.application,
          applicationList: action?.data,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_COLUMN_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state?.application,
          clientApplicationColumnNameList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.APPLICATION.CLIENT_APPLICATION_DEFAULT_COLUMN_LIST_ACTION: {
      return {
        ...state,
        application: {
          ...state?.application,
          clientApplicationDefaultColumnNameList: action?.data,
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.APPLICATION.UPDATE_CLIENT_APPLICATION_COLUMN_LIST_ACTION: {
      const clientApplicationColumnNameList = {
        ...state?.application?.clientApplicationColumnNameList,
      };
      const { name, type, value } = action?.data ?? {};
      clientApplicationColumnNameList[`${type}`] = clientApplicationColumnNameList[
        `${type}`
      ]?.map(e => (e?.name === name ? { ...e, isChecked: value } : e));
      return {
        ...state,
        application: {
          ...state?.application,
          clientApplicationColumnNameList,
        },
      };
    }
    // tasks
    case CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          taskList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          clientTaskColumnNameList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.CLIENT_TASK_DEFAULT_COLUMN_NAME_LIST_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          clientTaskDefaultColumnNameList: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.UPDATE_CLIENT_TASK_COLUMN_NAME_LIST_ACTION: {
      const clientTaskColumnNameList = {
        ...state?.task?.clientTaskColumnNameList,
      };
      const { name, type, value } = action?.data ?? {};
      clientTaskColumnNameList[`${type}`] = clientTaskColumnNameList[`${type}`]?.map(e =>
        e?.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        task: {
          ...state?.task,
          clientTaskColumnNameList,
        },
      };
    }
    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_UPDATE_ADD_TASK_FIELD_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
          addTask: {
            ...state?.task?.addTask,
            [action?.name]: action?.value,
          },
        },
      };

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
        type: data?.type,
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            entityList,
          },
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.DEFAULT_CLIENT_ENTITY_DROP_DOWN_DATA_ACTION: {
      const defaultEntityList = action?.data?.map(data => ({
        label: data?.name ?? data?.applicationId,
        value: data?._id,
        name: 'entityId',
      }));
      return {
        ...state,
        task: {
          ...state?.task,
          dropDownData: {
            ...state?.task?.dropDownData,
            entityList: defaultEntityList,
            defaultEntityList,
          },
        },
      };
    }

    case CLIENT_REDUX_CONSTANTS.TASK.ADD_TASK.CLIENT_RESET_ADD_TASK_STATE_ACTION:
      return {
        ...state,
        task: {
          ...state?.task,
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
          ...state?.task,
          addTask: action?.data,
        },
      };

    case CLIENT_REDUX_CONSTANTS.VIEW_CLIENT_ACTIVE_TAB_INDEX: {
      return {
        ...state,
        viewClientActiveTabIndex: action?.index,
      };
    }

    default:
      return state;
  }
};

export const clientManagementColumnList = (state = initialClientManagementColumnList, action) => {
  switch (action.type) {
    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_COLUMN_LIST_ACTION:
      return {
        ...state,
        clientColumnList: action?.data,
      };
    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.CLIENT_MANAGEMENT_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        clientDefaultColumnList: action?.data,
      };

    case CLIENT_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_CLIENT_MANAGEMENT_COLUMN_LIST_ACTION: {
      const temp = {
        ...state?.clientColumnList,
      };

      const { type, name, value } = action?.data ?? {};

      temp[`${type}`] = temp[`${type}`]?.map(e =>
        e?.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );

      return {
        ...state,
        clientColumnList: temp,
      };
    }
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
      return action?.data;
    default:
      return state;
  }
};
export const syncClientWithCrm = (state = [], action) => {
  switch (action.type) {
    case CLIENT_ADD_FROM_CRM_REDUX_CONSTANT.CLIENT_GET_LIST_FROM_CRM_ACTION:
      return action?.data;
    default:
      return state;
  }
};
