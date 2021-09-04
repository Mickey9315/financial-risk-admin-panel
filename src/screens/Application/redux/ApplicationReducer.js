import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_FILTER_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';

const initialApplicationList = {
  applicationList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
  },
  applicationColumnNameList: {},
  applicationDefaultColumnNameList: {},

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
      onEntityChange: { data: {}, openModal: false },
      clientId: [],
      postCode: '',
      state: [],
      country: {
        label: 'Australia',
        name: 'country',
        value: 'AUS',
      },
      suburb: '',
      streetType: [],
      streetName: '',
      streetNumber: '',
      unitNumber: '',
      property: '',
      address: '',
      entityType: [],
      phoneNumber: '',
      entityName: [],
      acn: '',
      abn: '',
      tradingName: '',
      debtorId: [],
      clientList: [],
      wipeOutDetails: false,
      registrationNo: '',
      errors: {},
      isActive: true,
    },
    creditLimit: {
      isExtendedPaymentTerms: false,
      extendedPaymentTermsDetails: '',
      isPassedOverdueAmount: false,
      passedOverdueDetails: '',
      creditLimit: '',
      outstandingAmount: '',
      orderOnHand: '',
      note: '',
      errors: {},
    },
    documents: {
      documentTypeList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
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
      error: false,
      errorMessage: '',
      data: [],
      hasMoreData: false,
    },
  },

  viewApplication: {
    isLoading: false,
    applicationDetail: {
      notesListLength: 0,
    },
    task: {
      taskList: [],
      addTask: {},
    },
    applicationModulesList: {
      documents: [],
      logs: [],
      viewApplicationDocumentType: [],
    },
    notes: {
      noteList: [],
    },
    reports: {
      reportList: [],
      reportsListForFetch: [],
    },
    alerts: {
      alertsList: [],
      alertDetail: {},
    },
    dropDownData: {
      assigneeList: [],
      entityList: [],
      defaultEntityList: [],
    },
  },
  importApplication: {
    activeStep: 0,
    importId: '',
    importFile: {
      file: null,
      error: '',
    },
    importData: {},
  },
};

export const application = (state = initialApplicationList, action) => {
  switch (action.type) {
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST_SUCCESS:
      return {
        ...state,
        applicationList: {
          ...state?.applicationList,
          ...action?.data,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.RESET_APPLICATION_LIST_PAGINATION_DATA:
      return {
        ...state,
        applicationList: {
          ...state?.applicationList,
          page: action?.page,
          pages: action?.pages,
          total: action?.total,
          limit: action?.limit,
          docs: [],
        },
      };
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_DETAILS:
      return {
        ...state,
        editApplication: { ...state?.editApplication, ...action?.data },
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION:
      return {
        ...state,
        applicationColumnNameList: action?.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        applicationDefaultColumnNameList: action?.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.applicationColumnNameList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        applicationColumnNameList: columnList,
      };
    }
    case APPLICATION_FILTER_LIST_REDUX_CONSTANTS.APPLICATION_FILTER_LIST_ACTION: {
      const dropdownData = { ...state?.applicationFilterList?.dropdownData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value.data.map(entity => ({
          label: entity.name ?? entity.label,
          name: value.field,
          value: entity._id ?? entity.value,
        }));
      });
      const applicationFilterList = {
        ...state?.applicationFilterList,
        dropdownData,
      };

      return {
        ...state,
        applicationFilterList,
      };
    }

    // Company step
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA: {
      const dropdownData = { ...state?.companyData?.dropdownData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        dropdownData[key] = value.data.map(entity => ({
          label: entity.name,
          name: value.field,
          value: entity._id,
        }));
      });
      const companyData = {
        ...state?.companyData,
        dropdownData,
      };

      return {
        ...state,
        companyData,
      };
    }
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_DEBTOR_DROP_DOWN_DATA: {
      const dropdownData = {
        ...state?.companyData?.dropdownData,
        [action?.name]: action?.data?.map(entity => ({
          label: entity.name,
          name: action?.name,
          value: entity._id,
        })),
      };
      const companyData = {
        ...state?.companyData,
        dropdownData,
      };

      return {
        ...state,
        companyData,
      };
    }
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_ENTITY_TYPE_DATA: {
      let entityNameSearchData = state?.companyData?.entityNameSearch?.data ?? [];
      let hasNoMoreRecords = false;

      if (action?.data?.data) {
        entityNameSearchData = [...entityNameSearchData, ...action?.data?.data];

        if (state?.companyData?.entityNameSearch?.data?.length === entityNameSearchData?.length)
          hasNoMoreRecords = true;
      }

      return {
        ...state,
        companyData: {
          ...state?.companyData,
          entityNameSearch: {
            ...state?.companyData?.entityNameSearch,
            data: entityNameSearchData,
            hasMoreData: !hasNoMoreRecords,
            isLoading: action?.data?.isLoading,
            error: action?.data?.error,
            errorMessage: action?.data?.errorMessage,
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.COMPANY.WIPE_OUT_ENTITY_TABLE_DATA:
      return {
        ...state,
        companyData: {
          ...state?.companyData,
          entityNameSearch: {
            isLoading: false,
            error: false,
            errorMessage: '',
            data: [],
            hasMoreData: false,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_WIPE_OUT_OLD_DATA_ON_SUCCESS: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          company: {
            ...state?.editApplication?.company,
            debtorId: action?.isDebtor ? { ...state?.editApplication?.company?.debtorId } : [],
            postCode: '',
            state: [],
            entityType: [],
            entityName: [],
            acn: '',
            abn: '',
            tradingName: '',
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_WIPE_OUT_DATA_IF_EXIST: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          company: {
            ...state?.editApplication?.company,
            clientId: [],
            postCode: '',
            state: [],
            country: {
              label: 'Australia',
              name: 'country',
              value: 'AUS',
            },
            suburb: '',
            streetType: [],
            streetName: '',
            streetNumber: '',
            unitNumber: '',
            property: '',
            address: '',
            entityType: [],
            phoneNumber: '',
            entityName: [],
            acn: '',
            abn: '',
            tradingName: '',
            debtorId: [],
            clientList: [],
            registrationNo: '',
          },
        },
      };
    }

    // edit application
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_CHANGE_FIELD_VALUE: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          [action?.name]: action?.value,
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_RESET_DATA: {
      return {
        ...state,
        editApplication: {
          ...initialApplicationList?.editApplication,
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          [action?.stepName]: { ...state?.editApplication?.[action.stepName], ...action?.data },
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.EDIT_APPLICATION
      .APPLICATION_COMPANY_EDIT_APPLICATION_UPDATE_FIELD: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          [action?.stepName]: {
            ...state?.editApplication?.[action?.stepName],
            [action?.name]: action?.value,
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.ADD_APPLICATION_PERSON: {
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners: [...(state?.editApplication?.partners ?? []), action?.data],
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.REMOVE_APPLICATION_PERSON: {
      const perStep = state?.editApplication?.partners;
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners: perStep.filter((e, i) => i !== action?.data),
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.EDIT_APPLICATION_PERSON: {
      const partners = [...state?.editApplication?.partners];
      partners[action?.index] = {
        ...partners?.[action?.index],
        [action?.name]: action?.value,
      };

      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners,
        },
      };
    }
    case APPLICATION_REDUX_CONSTANTS.PERSON.PERSON_STEP_COMPANY_EDIT_APPLICATION_UPDATE_ALL_DATA: {
      const partners = [...state?.editApplication?.partners];
      partners[action?.index] = {
        ...partners[action?.index],
        tradingName: action?.data?.tradingName ?? '',
        entityType: action?.data?.entityType ?? '',
        entityName: action?.data?.entityName ?? '',
        abn: action?.data?.abn ?? '',
        acn: action?.data?.acn ?? '',
      };

      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners,
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.PERSON.CHANGE_APPLICATION_PERSON_TYPE: {
      const partners = [...state?.editApplication?.partners];
      partners[action?.index] = {
        ...partners[action?.index],
        type: action?.personType,
      };

      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          partners,
        },
      };
    }

    // Documents
    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.DOCUMENT_TYPE_LIST_DATA:
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          documents: {
            ...state?.editApplication?.documents,
            documentTypeList: action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.DOCUMENTS.APPLICATION_DOCUMENT_GET_UPLOAD_DOCUMENT_DATA: {
      const editApplication = { ...state?.editApplication };
      const documents = { ...editApplication?.documents };
      const uploadDocumentApplicationData = [...action?.data];

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
      const editApplication = { ...state?.editApplication };
      const documents = { ...editApplication?.documents };
      const uploadDocumentApplicationData = [...documents?.uploadDocumentApplicationData];

      return {
        ...state,
        editApplication: {
          ...editApplication,
          documents: {
            ...documents,
            uploadDocumentApplicationData: [...uploadDocumentApplicationData, action?.data],
          },
        },
      };
    }

    // View Application
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_REQUEST_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          isLoading: true,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_SUCCESS_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationDetail: action?.data,
          isLoading: false,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_DETAIL_FAIL_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          isLoading: false,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_STATUS_CHANGE_ACTION: {
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationDetail: {
            ...state?.viewApplication?.applicationDetail,
            status: action?.data,
          },
        },
      };
    }

    // application task
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK.APPLICATION_TASK_LIST_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          task: {
            ...state?.viewApplication?.task,
            taskList: action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
      .APPLICATION_TASK_ASSIGNEE_DROP_DOWN_DATA_ACTION: {
      const assigneeList = action?.data?.map(data => ({
        label: data?.name,
        value: data?._id,
        name: 'assigneeId',
        type: data?.type,
      }));
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          dropDownData: {
            ...state?.viewApplication?.dropDownData,
            assigneeList,
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
      .APPLICATION_TASK_ENTITY_DROP_DOWN_DATA_ACTION: {
      const entityList = action?.data?.map(data => ({
        label: data.name ?? data.applicationId,
        value: data._id,
        name: 'entityId',
      }));
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          dropDownData: {
            ...state?.viewApplication?.dropDownData,
            entityList,
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
      .DEFAULT_APPLICATION_TASK_ENTITY_DROP_DOWN_DATA_ACTION: {
      const defaultEntityList = action?.data?.map(data => ({
        label: data.name ?? data.applicationId,
        value: data._id,
        name: 'entityId',
      }));
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          dropDownData: {
            ...state?.viewApplication?.dropDownData,
            entityList: defaultEntityList,
            defaultEntityList,
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
      .APPLICATION_UPDATE_TASK_FIELD_STATUS:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          task: {
            ...state?.viewApplication?.task,
            addTask: {
              ...state?.viewApplication?.task?.addTask,
              [action?.name]: action?.value,
            },
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
      .APPLICATION_RESET_ADD_TASK_STATE_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          task: {
            ...state?.viewApplication?.task,
            addTask: {},
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_TASK
      .GET_APPLICATION_TASK_DETAILS_ACTION:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          task: {
            ...state?.viewApplication?.task,
            addTask: action?.data,
          },
        },
      };

    // Application Module
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
      .APPLICATION_MODULE_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationModulesList: {
            ...state?.viewApplication?.applicationModulesList,
            ...action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
      .VIEW_APPLICATION_DOCUMENT_TYPE_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationModulesList: {
            ...state?.viewApplication?.applicationModulesList,
            viewApplicationDocumentType: action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_MODULES
      .VIEW_APPLICATION_UPLOAD_DOCUMENT_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          applicationModulesList: {
            ...state?.viewApplication?.applicationModulesList,
            documents: [...state?.viewApplication?.applicationModulesList?.documents, action?.data],
          },
        },
      };

    // notes
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_NOTES.APPLICATION_NOTES_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          notes: {
            ...state?.viewApplication?.notes,
            noteList: action?.data,
          },
          applicationDetail: {
            ...state?.viewApplication?.applicationDetail,
            notesListLength: action?.data?.docs?.length,
          },
        },
      };

    // reports
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_REPORTS
      .APPLICATION_REPORTS_LIST_DATA:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          reports: {
            ...state?.viewApplication?.reports,
            reportList: action?.data,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_REPORTS
      .FETCH_APPLICATION_REPORTS_LIST_DATA_FOR_FETCH: {
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          reports: {
            ...state?.viewApplication?.reports,
            reportsListForFetch: action?.data?.reports,
            partners: action?.data?.partners,
          },
        },
      };
    }

    case APPLICATION_REDUX_CONSTANTS.UPDATE_APPLICATION_DETAILS_ON_BACK_TO_COMPANY_STEP:
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          ...action?.data,
          applicationStage: action?.activeStep - 1,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.RESET_APPLICATION_LIST_DATA:
      return {
        ...state,
        applicationList: initialApplicationList.applicationList,
      };

    // import application

    case APPLICATION_REDUX_CONSTANTS.IMPORT_APPLICATION.GO_TO_NEXT_STEP:
      return {
        ...state,
        importApplication: {
          ...state?.importApplication,
          activeStep: (state?.importApplication?.activeStep ?? 0) + 1,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.IMPORT_APPLICATION.SET_FILE:
      return {
        ...state,
        importApplication: {
          ...state?.importApplication,
          importFile: {
            ...state?.importApplication?.importFile,
            file: action.file,
          },
        },
      };
    case APPLICATION_REDUX_CONSTANTS.IMPORT_APPLICATION.UPDATE_DATA_ERROR:
      return {
        ...state,
        importApplication: {
          ...state?.importApplication,
          [action.step]: {
            ...state?.importApplication?.[action.step],
            error: action.error,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.IMPORT_APPLICATION.RESET_STEPPER_DATA:
      return {
        ...state,
        importApplication: initialApplicationList.importApplication,
      };

    case APPLICATION_REDUX_CONSTANTS.IMPORT_APPLICATION.DELETE_IMPORTED_FILE:
      return {
        ...state,
        importApplication: {
          ...state?.importApplication,
          importFile: {
            ...state?.importApplication?.importFile,
            file: null,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.IMPORT_APPLICATION.UPDATE_DATA_ON_SUCCESS:
      // eslint-disable-next-line no-case-declarations
      let id = state?.importApplication?.importId;
      if (action?.data?.importId) id = action?.data?.importId;
      return {
        ...state,
        importApplication: {
          ...state?.importApplication,
          importId: id,
          importData: action.data,
        },
      };

    case APPLICATION_REDUX_CONSTANTS.COMPANY.ENTITY_TYPE_CHANGED:
      return {
        ...state,
        editApplication: {
          ...state?.editApplication,
          company: {
            ...state?.editApplication?.company,
            onEntityChange: {
              data: action?.data?.data,
              openModal: action?.data?.openModal,
            },
          },
        },
      };

    // Alerts
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_ALERTS
      .FETCH_APPLICATION_ALERTS_LIST:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          alerts: {
            ...state?.viewApplication.alerts,
            alertsList: action?.data?.docs,
          },
        },
      };

    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_ALERTS
      .GET_APPLICATION_ALERTS_DETAILS:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          alerts: {
            ...state?.viewApplication?.alerts,
            alertDetail: action?.data,
          },
        },
      };
    case APPLICATION_REDUX_CONSTANTS.VIEW_APPLICATION.APPLICATION_ALERTS
      .CLEAR_APPLICATION_ALERTS_DETAILS:
      return {
        ...state,
        viewApplication: {
          ...state?.viewApplication,
          alerts: {
            ...state?.viewApplication?.alerts,
            alertDetail: {},
          },
        },
      };

    default:
      return state;
  }
};
