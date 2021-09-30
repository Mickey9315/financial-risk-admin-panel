import { REPORTS_REDUX_CONSTANTS } from './ReportsReduxConstants';
import { REPORTS_FIELD_NAME_BY_ENTITIES } from '../../../constants/EntitySearchConstants';

const initialFilterState = {
  clientList: {
    filterInputs: [
      {
        type: 'select',
        name: 'riskAnalystId',
        label: 'Risk Analyst',
        placeHolder: 'Select risk analyst',
      },
      {
        type: 'select',
        name: 'serviceManagerId',
        label: 'Service Manager',
        placeHolder: 'Select service manager',
      },
      {
        type: 'dateRange',
        label: 'Inception Date',
        range: [
          {
            type: 'date',
            name: 'inceptionStartDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'inceptionEndDate',
            placeHolder: 'Select end date',
          },
        ],
      },
      {
        type: 'dateRange',
        label: 'Expiry Date',
        range: [
          {
            type: 'date',
            name: 'expiryStartDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'expiryEndDate',
            placeHolder: 'Select end date',
          },
        ],
      },
    ],
    tempFilter: {
      riskAnalystId: '',
      serviceManagerId: '',
      inceptionStartDate: null,
      inceptionEndDate: null,
      expiryStartDate: null,
      expiryEndDate: null,
    },
    finalFilter: {},
  },
  limitList: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'dateRange',
        label: 'Expiry Date',
        range: [
          {
            type: 'date',
            name: 'startDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'endDate',
            placeHolder: 'Select end date',
          },
        ],
      },
    ],
    tempFilter: {
      clientIds: '',
      startDate: null,
      endDate: null,
    },
    finalFilter: {},
  },
  pendingApplications: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'select',
        name: 'debtorId',
        label: 'Debtor',
        placeHolder: 'Select debtor',
      },
      {
        type: 'dateRange',
        label: 'Applied Date',
        range: [
          {
            type: 'date',
            name: 'startDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'endDate',
            placeHolder: 'Select end date',
          },
        ],
      },
    ],
    tempFilter: {
      clientIds: '',
      debtorId: '',
      startDate: null,
      endDate: null,
    },
    finalFilter: {},
  },
  usageReport: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'select',
        name: 'insurerId',
        label: 'Insurer',
        placeHolder: 'Select insurer',
      },
      {
        type: 'select',
        name: 'riskAnalystId',
        label: 'Risk Analyst',
        placeHolder: 'Select risk analyst',
      },
      {
        type: 'select',
        name: 'serviceManagerId',
        label: 'Service Manager',
        placeHolder: 'Select service manager',
      },
    ],
    tempFilter: {
      clientIds: '',
      debtorId: '',
      riskAnalystId: '',
      serviceManagerId: '',
    },
    finalFilter: {},
  },
  usagePerClient: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
    ],
    tempFilter: {
      clientIds: '',
    },
    finalFilter: {},
  },
  limitHistory: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'select',
        name: 'debtorId',
        label: 'Debtor',
        placeHolder: 'Select debtor',
      },
      {
        type: 'dateRange',
        label: 'Expiry Date',
        range: [
          {
            type: 'date',
            name: 'startDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'endDate',
            placeHolder: 'Select end date',
          },
        ],
      },
    ],
    tempFilter: {
      clientIds: '',
      debtorId: '',
      startDate: null,
      endDate: null,
    },
    finalFilter: {},
  },
  claimsReport: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
    ],
    tempFilter: {
      clientIds: '',
    },
    finalFilter: {},
  },
  reviewReport: {
    filterInputs: [
      {
        type: 'clientSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'select',
        name: 'debtorId',
        label: 'Debtor',
        placeHolder: 'Select debtor',
      },
      {
        type: 'dateRange',
        label: 'Limit Expiry Date',
        range: [
          {
            type: 'date',
            name: 'limitStartDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'limitEndDate',
            placeHolder: 'Select end date',
          },
        ],
      },
      {
        type: 'dateRange',
        label: 'Report Expiry Date',
        range: [
          {
            type: 'date',
            name: 'reportStartDate',
            placeHolder: 'Select start date',
          },
          {
            type: 'date',
            name: 'reportEndDate',
            placeHolder: 'Select end date',
          },
        ],
      },
    ],
    tempFilter: {
      clientIds: '',
      debtorId: '',
      limitStartDate: null,
      limitEndDate: null,
      reportStartDate: null,
      reportEndDate: null,
    },
    finalFilter: {},
  },
};

const initialReports = {
  reportsList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
  },

  reportFilters: {},

  reportColumnList: {},
  reportDefaultColumnList: {},

  reportEntityListData: [],
};

export const reports = (state = initialReports, action) => {
  switch (action.type) {
    case REPORTS_REDUX_CONSTANTS.INITIALIZE_FILTERS:
      return {
        ...state,
        reportFilters: initialFilterState,
      };

    case REPORTS_REDUX_CONSTANTS.GET_REPORT_LIST_SUCCESS:
      return {
        ...state,
        reportsList: {
          ...action.data,
          isLoading: false,
        },
      };

    case REPORTS_REDUX_CONSTANTS.GET_REPORT_COLUMN_LIST:
      return {
        ...state,
        reportColumnList: action.data,
      };

    case REPORTS_REDUX_CONSTANTS.GET_REPORT_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        reportDefaultColumnList: action.data,
      };

    case REPORTS_REDUX_CONSTANTS.UPDATE_REPORT_COLUMN_LIST: {
      const columnList = {
        ...state.reportColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[type] = columnList[type].map(field =>
        field.name === name ? { ...field, isChecked: value } : field
      );
      return {
        ...state,
        reportColumnList: columnList,
      };
    }

    case REPORTS_REDUX_CONSTANTS.GET_DROPDOWN_CLIENT_LIST: {
      const reportEntityListData = { ...state?.reportEntityListData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        reportEntityListData[key] = value.map(entity => ({
          label: entity.name,
          name: key,
          value: entity._id,
          secondValue: key === 'clientIds' ? entity.clientId : undefined,
        }));
      });

      return {
        ...state,
        reportEntityListData,
      };
    }

    case REPORTS_REDUX_CONSTANTS.GET_DROPDOWN_LIST_BY_SEARCH: {
      const name = REPORTS_FIELD_NAME_BY_ENTITIES[action?.name];
      const dropdownData = {
        ...state?.reportEntityListData,
        [name]: action?.data?.map(entity => ({
          label: entity.name,
          name,
          value: entity._id,
          secondValue: name === 'clientIds' ? entity.clientId : undefined,
        })),
      };
      return {
        ...state,
        reportEntityListData: dropdownData,
      };
    }

    case REPORTS_REDUX_CONSTANTS.UPDATE_REPORT_FILTER_FIELDS:
      return {
        ...state,
        reportFilters: {
          ...state.reportFilters,
          [action?.filterFor]: {
            ...state.reportFilters[action?.filterFor],
            tempFilter: {
              ...state.reportFilters[action?.filterFor].tempFilter,
              [action.name]: action.value,
            },
          },
        },
      };

    case REPORTS_REDUX_CONSTANTS.APPLY_REPORT_FILTER_ACTION:
      return {
        ...state,
        reportFilters: {
          ...state.reportFilters,
          [action?.filterFor]: {
            ...state.reportFilters[action?.filterFor],
            finalFilter: state.reportFilters[action?.filterFor].tempFilter,
          },
        },
      };

    case REPORTS_REDUX_CONSTANTS.CLOSE_REPORT_FILTER_ACTION:
      return {
        ...state,
        reportFilters: {
          ...state.reportFilters,
          [action?.filterFor]: {
            ...state.reportFilters[action?.filterFor],
            tempFilter: state.reportFilters[action?.filterFor].finalFilter,
          },
        },
      };

    case REPORTS_REDUX_CONSTANTS.RESET_REPORT_FILTER:
      return {
        ...state,
        reportFilters: {
          ...state.reportFilters,
          [action.filterFor]: initialFilterState[action.filterFor],
        },
      };

    case REPORTS_REDUX_CONSTANTS.RESET_REPORT_LIST_DATA:
      return {
        ...state,
        reportsList: initialReports.reportsList,
      };

    default:
      return state;
  }
};
