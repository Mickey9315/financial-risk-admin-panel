import { LOGIN_REDUX_CONSTANTS } from "../../auth/login/redux/LoginReduxConstants";
import { ALERTS_REDUX_CONSTANTS } from "./AlertsReduxConstants";
import { REPORTS_FIELD_NAME_BY_ENTITIES } from "../../../constants/EntitySearchConstants";

const initialAlerts = {
  alertsList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
  },
  alertDetail: {},
  alertColumnList: {},
  alertDefaultColumnList: {},

  alertEntityListData: [],
  alertId: '',
  alertStatusListData: [
    {
      label: 'Pending',
      name: 'status',
      value: 'Pending',
    },
    {
      label: 'Processed',
      name: 'status',
      value: 'Processed'
    },
  ],
};

export const alerts = (state = initialAlerts, action) => {
  switch (action.type) {
    case ALERTS_REDUX_CONSTANTS.GET_ALERT_LIST_SUCCESS:
      return {
        ...state,
        alertsList: {
          ...action.data,
          isLoading: false,
        },
      };

    case ALERTS_REDUX_CONSTANTS.GET_ALERT_COLUMN_LIST:
      return {
        ...state,
        alertColumnList: action.data,
      };

    case ALERTS_REDUX_CONSTANTS.GET_ALERT_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        alertDefaultColumnList: action.data,
      };

    case ALERTS_REDUX_CONSTANTS.UPDATE_ALERT_COLUMN_LIST: {
      const columnList = {
        ...state.alertColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[type] = columnList[type].map(field =>
        field.name === name ? { ...field, isChecked: value } : field
      );
      return {
        ...state,
        alertColumnList: columnList,
      };
    }

    case ALERTS_REDUX_CONSTANTS.GET_DROPDOWN_CLIENT_LIST: {
      const alertEntityListData = { ...state?.alertEntityListData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        alertEntityListData[key] = value.map(entity => ({
          label: entity.name,
          name: key,
          value: entity._id,
          secondValue: key === 'clientIds' ? entity.clientId : undefined,
        }));
      });
      return {
        ...state,
        alertEntityListData,
      }
    }

    case ALERTS_REDUX_CONSTANTS.GET_ALERT_FILTER_DROPDOWN_DATA: {
      const alertEntityListData = { ...state?.alertEntityListData };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        if (key !== 'clientIds')
          alertEntityListData[key] = value.map(record => ({
            label: record,
            name: key,
            value: record,
          }));
      });
      return {
        ...state,
        alertEntityListData,
      };
    }

    case ALERTS_REDUX_CONSTANTS.GET_DROPDOWN_LIST_BY_SEARCH: {
      const name = REPORTS_FIELD_NAME_BY_ENTITIES[action?.name];
      const dropdownData = {
        ...state?.alertEntityListData,
        [name]: action?.data?.map(entity => ({
          label: entity.name,
          name,
          value: entity._id,
          secondValue: name === 'clientIds' ? entity.clientId : undefined,
        })),
      };
      return {
        ...state,
        alertEntityListData: dropdownData,
      };
    }

    case ALERTS_REDUX_CONSTANTS.RESET_ALERT_LIST_DATA:
      return {
        ...state,
        alertsList: initialAlerts.alertsList,
      };

    case ALERTS_REDUX_CONSTANTS.GET_ALERT_DETAILS:
      return {
        ...state,
        alertDetail: action?.data,
      };

    case ALERTS_REDUX_CONSTANTS.CLEAR_ALERT_DETAILS:
      return {
        ...state,
        alertDetail: {},
      };

    case ALERTS_REDUX_CONSTANTS.SAVE_ALERT_ID:
      return {
        ...state,
        alertId: action?.data,
      };

    case ALERTS_REDUX_CONSTANTS.REMOVE_ALERT_ID:
      return {
        ...state,
        alertId: '',
      };

    case ALERTS_REDUX_CONSTANTS.UPDATE_ALERT_DETAILS_STATUS:
      return {
        ...state,
        alertDetail: {
          ...state.alertDetail,
          alertDetails: state?.alertDetail?.alertDetails.map((i) => {
            if (i.label === 'Status') {
              const temp = i;
              temp.value = action.data;
              return temp;
            }
            return i;
          })
        },
        alertsList: {
          ...state.alertsList,
          docs: state.alertsList.docs.map((i) => {
            if (i._id === state.alertId) {
              const temp = i;
              temp.status = action.data;
              return temp;
            }
            return i;
          })
        }
      };
    default:
      return state;
  }
};

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

export const alertAllFilters = (state = initialFilterState, action) => {
  switch (action.type) {
    case ALERTS_REDUX_CONSTANTS.INITIALIZE_FILTERS:{
      return state || initialFilterState;
    }
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
    case ALERTS_REDUX_CONSTANTS.CLOSE_ALERT_FILTER_ACTION:
      return {
        ...state,
        tempFilter: state?.finalFilter,
      }
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