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

  alertColumnList: {},
  alertDefaultColumnlist: {},

  alertEntityListData: [],
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
        alertDefaultColumnlist: action.data,
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

    default:
      return state;
  }
};