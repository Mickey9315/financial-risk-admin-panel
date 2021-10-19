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
      ],
      tempFilter: {
        clientIds: '',
        debtorId: '',
      },
      finalFilter: {},
    },
  };

 export const reportAllFilters = (state = {}, action) => {
    switch (action.type) {
      case REPORTS_REDUX_CONSTANTS.INITIALIZE_FILTERS:
        return {
            clientList: state?.clientList || initialFilterState?.clientList,
            limitList: state?.limitList || initialFilterState?.limitList,
            pendingApplications:
              state?.pendingApplications || initialFilterState?.pendingApplications,
            usageReport: state?.usageReport || initialFilterState?.usageReport,
            usagePerClient:
              state?.usagePerClient || initialFilterState?.usagePerClient,
            limitHistory: state?.limitHistory || initialFilterState?.limitHistory,
            claimsReport: state?.claimsReport || initialFilterState?.claimsReport,
            reviewReport: state?.reviewReport || initialFilterState?.reviewReport,
        };
        case REPORTS_REDUX_CONSTANTS.UPDATE_REPORT_FILTER_FIELDS:
            return {
                ...state,
                [action?.filterFor]: {
                  ...state[action?.filterFor],
                  tempFilter: {
                    ...state[action?.filterFor].tempFilter,
                    [action.name]: action.value,
                  },
                },
            };
      
          case REPORTS_REDUX_CONSTANTS.APPLY_REPORT_FILTER_ACTION:
            return {
              ...state,
                [action?.filterFor]: {
                  ...state[action?.filterFor],
                  finalFilter: state[action?.filterFor].tempFilter,
              },
            };
      
          case REPORTS_REDUX_CONSTANTS.CLOSE_REPORT_FILTER_ACTION:
            return {
              ...state,
                [action?.filterFor]: {
                  ...state[action?.filterFor],
                  tempFilter: state[action?.filterFor].finalFilter,
              },
            };
      
          case REPORTS_REDUX_CONSTANTS.RESET_REPORT_FILTER:
            return {
              ...state,
                [action.filterFor]: initialFilterState[action.filterFor],
            };
            
            default:
                return state;
            }
          };      