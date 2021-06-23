import { REPORTS_REDUX_CONSTANTS } from './ReportsReduxConstants';

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
    filterValues: {
      riskAnalystId: '',
      serviceManagerId: '',
      inceptionStartDate: null,
      inceptionEndDate: null,
      expiryStartDate: null,
      expiryEndDate: null,
    },
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
        label: 'Date',
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
    filterValues: {
      clientIds: '',
      startDate: null,
      endDate: null,
    },
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
        label: 'Date',
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
    filterValues: {
      clientIds: '',
      debtorId: '',
      startDate: null,
      endDate: null,
    },
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
    filterValues: {
      clientIds: '',
      debtorId: '',
      riskAnalystId: '',
      serviceManagerId: '',
    },
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
    filterValues: {
      clientIds: '',
    },
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
        label: 'Date',
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
    filterValues: {
      clientIds: '',
      debtorId: '',
      startDate: null,
      endDate: null,
    },
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
    filterValues: {
      clientIds: '',
    },
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
        label: 'Limit Date',
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
        label: 'Report Date',
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
    filterValues: {
      clientIds: '',
      debtorId: '',
      limitStartDate: null,
      limitEndDate: null,
      reportStartDate: null,
      reportEndDate: null,
    },
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
    isLoading: false,
  },

  reportFilters: {},

  reportColumnList: {},
  reportDefaultColumnList: {},

  reportEntityListData: [],
};

export const reports = (state = initialReports, action) => {
  switch (action.type) {
    case REPORTS_REDUX_CONSTANTS.GET_REPORT_LIST_REQUEST:
      return {
        ...state,
        reportsList: {
          ...state?.reportsList,
          isLoading: true,
        },
      };

    case REPORTS_REDUX_CONSTANTS.GET_REPORT_LIST_SUCCESS:
      return {
        ...state,
        reportsList: {
          ...action.data,
          isLoading: false,
        },
      };

    case REPORTS_REDUX_CONSTANTS.GET_REPORT_LIST_FAILURE:
      return {
        ...state,
        reportsList: {
          ...state?.reportsList,
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
        reportFilters: initialFilterState,
      };
    }

    case REPORTS_REDUX_CONSTANTS.UPDATE_REPORT_FILTER_FIELDS:
      return {
        ...state,
        reportFilters: {
          ...state.reportFilters,
          [action?.filterFor]: {
            ...state.reportFilters[action?.filterFor],
            filterValues: {
              ...state.reportFilters[action?.filterFor].filterValues,
              [action.name]: action.value,
            },
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

    default:
      return state;
  }
};
