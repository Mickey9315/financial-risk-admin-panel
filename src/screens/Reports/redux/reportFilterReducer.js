import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
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
        type: 'multiSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'multiSelect',
        name: 'limitType',
        label: 'Limit Type',
        placeHolder: 'Select Limit Type',
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
        type: 'multiSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'multiSelect',
        name: 'limitType',
        label: 'Limit Type',
        placeHolder: 'Select Limit Type',
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
        type: 'multiSelect',
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
      insurerId: '',
      riskAnalystId: '',
      serviceManagerId: '',
    },
    finalFilter: {},
  },
  usagePerClient: {
    filterInputs: [
      {
        type: 'multiSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'multiSelect',
        name: 'limitType',
        label: 'Limit Type',
        placeHolder: 'Select Limit Type',
      },
    ],
    tempFilter: {
      clientIds: '',
      limitType: '',
    },
    finalFilter: {},
  },
  limitHistory: {
    filterInputs: [
      {
        type: 'multiSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'multiSelect',
        name: 'limitType',
        label: 'Limit Type',
        placeHolder: 'Select Limit Type',
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
        type: 'multiSelect',
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
        type: 'multiSelect',
        name: 'clientIds',
        label: 'Clients',
        placeHolder: 'Select clients',
      },
      {
        type: 'select',
        name: 'entityType',
        label: 'Entity Type',
        placeHolder: 'Select entity type',
      },
    ],
    tempFilter: {
      clientIds: '',
      debtorId: '',
    },
    finalFilter: {},
  },
  alert: {
    filterInputs: [
      {
        type: 'multiSelect',
        name: 'clientIds',
        label: 'Client',
        placeHolder: 'Select clients',
      },
      {
        type: 'dateRange',
        label: 'Alert Date',
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
      {
        type: 'select',
        name: 'alertType',
        label: 'Alert Type',
        placeHolder: 'Select alert type',
      },
      {
        type: 'select',
        name: 'alertPriority',
        label: 'Alert Priority',
        placeHolder: 'Select alert priority',
      },
    ],
    tempFilter: {
      clientIds: '',
      alertPriority: '',
      alertType: '',
      startDate: '',
      endDate: '',
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
        pendingApplications: state?.pendingApplications || initialFilterState?.pendingApplications,
        usageReport: state?.usageReport || initialFilterState?.usageReport,
        usagePerClient: state?.usagePerClient || initialFilterState?.usagePerClient,
        limitHistory: state?.limitHistory || initialFilterState?.limitHistory,
        claimsReport: state?.claimsReport || initialFilterState?.claimsReport,
        reviewReport: state?.reviewReport || initialFilterState?.reviewReport,
        alert: state?.alert || initialFilterState?.alert,
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
          tempFilter: state?.[action?.filterFor]?.finalFilter,
        },
      };

    case REPORTS_REDUX_CONSTANTS.RESET_REPORT_FILTER:
      return {
        ...state,
        [action.filterFor]: initialFilterState[action.filterFor],
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return {};

    default:
      return state;
  }
};
