import {
  DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS,
  DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS,
  DEBTORS_REDUX_CONSTANTS,
} from './DebtorsReduxConstants';
import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';

const initialDebtorState = {
  debtorsList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  debtorsColumnNameList: {},
  selectedDebtorData: {},
  dropdownData: {
    streetType: [],
    australianStates: [],
    entityType: [],
  },
};

export const debtorsManagement = (state = initialDebtorState, action) => {
  switch (action.type) {
    case DEBTORS_REDUX_CONSTANTS.DEBTORS_LIST_USER_ACTION:
      return {
        ...state,
        debtorsList: action.data,
      };
    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION:
      return {
        ...state,
        debtorsColumnNameList: action.data,
      };
    case DEBTORS_MANAGEMENT_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_DEBTORS_MANAGEMENT_COLUMN_LIST_ACTION:
      // eslint-disable-next-line no-case-declarations
      const temp = {
        ...state.debtorsColumnNameList,
      };
      // eslint-disable-next-line no-case-declarations
      const { name, type, value } = action.data;
      temp[`${type}`] = temp[`${type}`].map(e =>
        e.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        debtorsColumnNameList: temp,
      };
    case DEBTORS_REDUX_CONSTANTS.SELECTED_DEBTORS_DATA:
      return {
        ...state,
        selectedDebtorData: action.data,
      };
    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTORS_MANAGEMENT_DROPDOWN_LIST_REDUX_CONSTANTS: {
      console.log(action.data);
      const dropdownData = {};
      // eslint-disable-next-line no-shadow
      Object.entries(action.data).forEach(([key, value]) => {
        dropdownData[key] = value.map(entity => ({
          label: entity.name,
          name: key,
          value: entity._id,
        }));
      });
      return {
        ...state,
        dropdownData,
      };
    }
    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ACTION:
      return {
        ...state,
        selectedDebtorData: {
          ...state.selectedDebtorData,
          [`${action.data.name}`]: `${action.data.value}`,
        },
      };
    case DEBTOR_MANAGEMENT_CRUD_REDUX_CONSTANTS.DEBTOR_MANAGEMENT_UPDATE_DEBTOR_ADDRESS_ACTION:
      return {
        ...state,
        selectedDebtorData: {
          ...state.selectedDebtorData,
          address: {
            ...state.selectedDebtorData.address,
            [`${action.data.name}`]: `${action.data.value}`,
          },
        },
      };

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
