import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_FILTER_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';

const initialApplicationList = {
  applicationList: {
    docs: [],
    total: 0,
    limit: 0,
    page: 1,
    pages: 1,
    headers: [],
  },
  applicationColumnNameList: {},

  applicationFilterList: {
    dropdownData: {
      clients: [],
      debtors: [],
      streetType: [],
      australianStates: [],
      entityType: [],
      applicationStatus: [],
    },
  },

  editApplication: {
    currentStepIndex: 0,
    companyStep: {
      clientId: [],
      postcode: '',
      state: [],
      suburb: '',
      streetType: [],
      streetName: '',
      streetNumber: '',
      unitNumber: '',
      property: '',
      address: '',
      outstandingAmount: '',
      entityType: [],
      phoneNumber: '',
      entityName: [],
      acn: '',
      abn: '',
      tradingName: '',
      debtor: [],
      errors: {},
    },
    creditLimitStep: {
      isExtendedPaymentTerms: '',
      extendedPaymentTermsDetails: '',
      isPassedOverdueAmount: '',
      passedOverdueDetails: '',
      creditLimit: '',
      errors: {},
    },
  },

  company: {
    dropdownData: {
      clients: [],
      debtors: [],
      streetType: [],
      australianStates: [],
      entityType: [],
    },
    entityNameSearch: {
      isLoading: false,
      data: [],
    },
  },
};

export const application = (state = initialApplicationList, action) => {
  switch (action.type) {
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST:
      return {
        ...state,
        applicationList: action.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION:
      return {
        ...state,
        applicationColumnNameList: action.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.applicationColumnNameList,
      };
      const { type, name, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        applicationColumnNameList: columnList,
      };
    }
    case APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_ACTION: {
      const dropdownData = { ...state.applicationFilterList.dropdownData };
      Object.entries(action.data).forEach(([key, value]) => {
        dropdownData[key] = value.data.map(entity => ({
          label: entity.name,
          name: value.field,
          value: entity._id,
        }));
      });
      const applicationFilterList = {
        ...state.applicationFilterList,
        dropdownData,
      };

      return {
        ...state,
        applicationFilterList,
      };
    }

    // Company step
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA: {
      const dropdownData = { ...state.company.dropdownData };
      Object.entries(action.data).forEach(([key, value]) => {
        dropdownData[key] = value.data.map(entity => ({
          label: entity.name,
          name: value.field,
          value: entity._id,
        }));
      });
      const company = {
        ...state.company,
        dropdownData,
      };

      return {
        ...state,
        company,
      };
    }
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA: {
      const entityNameSearch = { ...action.data };
      const company = {
        ...state.company,
        entityNameSearch,
      };

      return {
        ...state,
        company,
      };
    }

    // edit application
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_CHANGE_FIELD_VALUE: {
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          [action.name]: action.value,
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA: {
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          [action.stepName]: { ...state.editApplication[action.stepName], ...action.data },
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_FIELD: {
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          [action.stepName]: {
            ...state.editApplication[action.stepName],
            [action.name]: action.value,
          },
        },
      };
    }

    default:
      return state;
  }
};
