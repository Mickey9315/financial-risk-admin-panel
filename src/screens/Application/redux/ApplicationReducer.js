import {
  APPLICATION_COLUMN_LIST_REDUX_CONSTANTS,
  APPLICATION_REDUX_CONSTANTS,
} from './ApplicationReduxConstants';

const initialApplicationList = {
  applicationList: {
    docs: [],
    total: 0,
    limit: 0,
    page: 1,
    pages: 1,
    headers: [],
  },
  applicationColumnNameList: [],

  company: {
    dropdownData: {
      clients: [],
      debtors: [],
      streetType: [],
      australianStates: [],
      entityType: [],
    },
  },
};

export const application = (state = initialApplicationList, action) => {
  switch (action.type) {
    case APPLICATION_REDUX_CONSTANTS.APPLICATION_LIST:
      return {
        ...state,
        applicationList: action.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.APPLICATION_COLUMN_LIST_ACTION:
      return {
        ...state,
        applicationColumnNameList: action.data,
      };
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state.applicationColumnNameList,
      };
      const { type, name, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );

      return {
        ...state,
        applicationColumnNameList: columnList,
      };
    }

    // Company step
    case APPLICATION_REDUX_CONSTANTS.COMPANY.APPLICATION_COMPANY_DROP_DOWN_DATA: {
      const dropdownData = { ...state.company.dropdownData };
      Object.entries(action.data).forEach(([key, value]) => {
        dropdownData[key] = value.map(entity => ({ label: entity.name, value: entity._id }));
      });
      const company = {
        ...state.company,
        dropdownData,
      };

      return {
        ...state,
        company,
      };
    }

    default:
      return state;
  }
};
