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
      companyEntityType: [],
      countryList: [],
    },
  },

  editApplication: {
    applicationStage: 0,
    _id: '',
    entityType: '',
    company: {
      clientId: [],
      postCode: '',
      state: [],
      country: [],
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
      debtorId: [],
      clientList: [],
      wipeOutDetails: false,
      errors: {},
    },
    creditLimit: {
      isExtendedPaymentTerms: false,
      extendedPaymentTermsDetails: '',
      isPassedOverdueAmount: false,
      passedOverdueDetails: '',
      creditLimit: '',
      errors: {},
    },
    documents: {
      documentTypeList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
      uploadDocumentApplicationData: [],
    },
    partners: [],
  },

  /* personStep: {
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    driverLicenceNumber: '',
    phoneNumber: '',
    mobileNumber: '',
    email: '',
    address: {
      property: '',
      unitNumber: '',
      streetNumber: '',
      streetName: '',
      streetType: '',
      suburb: '',
      state: '',
      country: '',
      postCode: '',
    },
  }, */
  companyData: {
    dropdownData: {
      clients: [],
      debtors: [],
      streetType: [],
      australianStates: [],
      newZealandStates: [],
      entityType: [],
      countryList: [],
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
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_DETAILS:
      return {
        ...state,
        editApplication: { ...state.editApplication, ...action.data },
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
      const dropdownData = { ...state.companyData.dropdownData };
      Object.entries(action.data).forEach(([key, value]) => {
        dropdownData[key] = value.data.map(entity => ({
          label: entity.name,
          name: value.field,
          value: entity._id,
        }));
      });
      const companyData = {
        ...state.companyData,
        dropdownData,
      };

      return {
        ...state,
        companyData,
      };
    }
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA: {
      const entityNameSearch = { ...action.data };
      const companyData = {
        ...state.companyData,
        entityNameSearch,
      };

      return {
        ...state,
        companyData,
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

    case APPLICATION_REDUX_CONSTANTS.PERSON.ADD_APPLICATION_PERSON: {
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          partners: [...state.editApplication.partners, action.data],
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.REMOVE_APPLICATION_PERSON: {
      const perStep = state.editApplication.partners;
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          partners: perStep.filter((e, i) => i !== action.data),
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.WIPE_OUT_PERSON_STEP_DATA: {
      // const perStep = state.editApplication.partners;
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          partners: action.data,
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.EDIT_APPLICATION_PERSON: {
      const partners = [...state.editApplication.partners];
      partners[action.index] = {
        ...partners[action.index],
        [action.name]: action.value,
      };

      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          partners,
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.PERSON.PERSON_STEP_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA: {
      const partners = [...state.editApplication.partners];
      partners[action.index] = {
        ...partners[action.index],
        ...action.data,
      };

      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          partners,
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.CHANGE_APPLICATION_PERSON_TYPE: {
      const partners = [...state.editApplication.partners];
      partners[action.index] = {
        ...action.data,
      };

      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          partners,
        },
      };
    }

    // Documents
    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA:
      return {
        ...state,
        editApplication: {
          ...state.editApplication,
          documents: {
            ...state.editApplication.documents,
            documentTypeList: action.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.APPLICATION_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA: {
      const editApplication = { ...state.editApplication };
      const documents = { ...editApplication.documents };
      const uploadDocumentApplicationData = [...action.data];

      return {
        ...state,
        editApplication: {
          ...editApplication,
          documents: {
            ...documents,
            uploadDocumentApplicationData,
          },
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.UPLOAD_DOCUMENT_DATA: {
      const editApplication = { ...state.editApplication };
      const documents = { ...editApplication.documents };
      const uploadDocumentApplicationData = [...documents.uploadDocumentApplicationData];

      return {
        ...state,
        editApplication: {
          ...editApplication,
          documents: {
            ...documents,
            uploadDocumentApplicationData: [...uploadDocumentApplicationData, action.data],
          },
        },
      };
    }

    default:
      return state;
  }
};
