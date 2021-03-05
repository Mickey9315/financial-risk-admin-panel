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
    case APPLICATION_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_APPLICATION_COLUMN_LIST_ACTION: // updates column list checked
      // eslint-disable-next-line no-case-declarations
      const columnList = {
        ...state.applicationColumnNameList,
      };
      // eslint-disable-next-line no-case-declarations
      const { type, name, value } = action.data;
      columnList[`${type}`] = columnList[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );

      return {
        ...state,
        applicationColumnNameList: columnList,
      };

    default:
      return state;
  }
};
