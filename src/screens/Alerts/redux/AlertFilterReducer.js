import { LOGIN_REDUX_CONSTANTS } from "../../auth/login/redux/LoginReduxConstants";
import { ALERTS_REDUX_CONSTANTS } from "./AlertsReduxConstants";

const initialFilterState = {
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
};

export const alertAllFilters = (state = {}, action) => {
  switch (action.type) {
    case ALERTS_REDUX_CONSTANTS.INITIALIZE_FILTERS:
      return state || initialFilterState;
    case ALERTS_REDUX_CONSTANTS.UPDATE_ALERT_FILTER_FIELDS:
      return {
        ...state,
        tempFilter: {
          ...state.tempFilter,
          [action.name]: action.value,
        },
      };
    case ALERTS_REDUX_CONSTANTS.APPLY_ALERT_FILTER_ACTION:
      return {
        ...state,
        finalFilter: state.tempFilter,
      };
    case ALERTS_REDUX_CONSTANTS.RESET_ALERT_FILTER:
      return {
        ...state,
        initialFilterState
      };
    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return {};
    default:
      return state;
  }
}