import { REPORTS_REDUX_CONSTANTS } from './ReportsReduxConstants';
import { REPORTS_FIELD_NAME_BY_ENTITIES } from '../../../constants/EntitySearchConstants';

const initialReports = {
  reportsList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
  },

  reportColumnList: {},
  reportDefaultColumnList: {},

  reportEntityListData: [],
};

export const reports = (state = initialReports, action) => {
  switch (action.type) {
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

    case REPORTS_REDUX_CONSTANTS.GET_ALERT_FILTER_DROPDOWN_DATA: {
      const reportEntityListData = { ...state?.reportEntityListData };

      Object.entries(action?.data)?.forEach(([key, value]) => {
        if (key !== 'clientIds')
          reportEntityListData[key] = value.map(record => ({
            label: record,
            name: key,
            value: record,
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

    case REPORTS_REDUX_CONSTANTS.RESET_REPORT_LIST_DATA:
      return {
        ...state,
        reportsList: initialReports.reportsList,
      };

    default:
      return state;
  }
};
