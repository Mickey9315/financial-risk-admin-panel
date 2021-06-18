import { REPORTS_REDUX_CONSTANTS } from './ReportsReduxConstants';

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

  reportColumnList: {},
  reportDefaultColumnList: {},

  reportDropdownClientData: [],
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
      return {
        ...state,
        reportDropdownClientData: action.data,
      };
    }

    default:
      return state;
  }
};
