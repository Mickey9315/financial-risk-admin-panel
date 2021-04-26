import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import {
  INSURER_COLUMN_LIST_REDUX_CONSTANTS,
  INSURER_CRM_REDUX_CONSTANTS,
  INSURER_REDUX_CONSTANTS,
  INSURER_VIEW_REDUX_CONSTANT,
} from './InsurerReduxConstants';

const initialInsurer = {
  insurerList: {
    docs: [],
    total: 0,
    limit: 0,
    page: 1,
    pages: 1,
    headers: [],
  },
  insurerColumnNameList: {},
  insurerViewData: {},
  syncInsurerWithCRM: [],
  contact: {
    contactList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
  },
  policies: {
    policiesList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    columnList: { docs: [], total: 0, limit: 0, page: 1, pages: 1 },
    policySyncList: [],
  },
  matrix: {
    generalGuideLines: [],
    priceRange: [],
  },
};

export const insurer = (state = initialInsurer, action) => {
  switch (action.type) {
    case INSURER_REDUX_CONSTANTS.INSURER_LIST_USER_ACTION:
      return {
        ...state,
        insurerList: action?.data,
      };

    case INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_COLUMN_LIST_ACTION:
      return {
        ...state,
        insurerColumnNameList: action?.data,
      };

    case INSURER_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_INSURER_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.insurerColumnNameList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`]?.map(e =>
        e?.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        insurerColumnNameList: columnList,
      };
    }
    case INSURER_VIEW_REDUX_CONSTANT.VIEW_INSURER_DATA:
      return {
        ...state,
        insurerViewData: action?.data,
      };
    case INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_LIST_USER_ACTION:
      return {
        ...state,
        contact: {
          ...state?.contact,
          contactList: action?.data,
        },
      };
    case INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_COLUMN_LIST_ACTION:
      return {
        ...state,
        contact: {
          ...state?.contact,
          columnList: action?.data,
        },
      };
    case INSURER_VIEW_REDUX_CONSTANT.CONTACT.UPDATE_INSURER_CONTACT_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.contact?.columnList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList[`${type}`]?.map(e =>
        e?.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        contact: {
          ...state?.contact,
          columnList,
        },
      };
    }
    case INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_LIST_USER_ACTION:
      return {
        ...state,
        policies: {
          ...state?.policies,
          policiesList: action?.data,
        },
      };
    case INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_COLUMN_LIST_ACTION:
      return {
        ...state,
        policies: {
          ...state?.policies,
          columnList: action?.data,
        },
      };

    case INSURER_VIEW_REDUX_CONSTANT.POLICIES.UPDATE_POLICIES_CONTACT_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.policies?.columnList,
      };

      const { type, name, value } = action?.data;

      columnList[`${type}`] = columnList[`${type}`]?.map(e =>
        e?.name === name
          ? {
              ...e,
              isChecked: value,
            }
          : e
      );
      return {
        ...state,
        policies: {
          ...state?.policies,
          columnList,
        },
      };
    }

    case INSURER_VIEW_REDUX_CONSTANT.MATRIX.INSURER_MATRIX_GET_DATA:
      return { ...state, matrix: action?.data };

    case INSURER_CRM_REDUX_CONSTANTS.INSURER_GET_LIST_FROM_CRM_ACTION:
      return {
        ...state,
        syncInsurerWithCRM: action?.data,
      };

    case INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICY_SYNC_LIST_BY_SEARCH: {
      return {
        ...state,
        policies: {
          ...state?.policies,
          policySyncList: action?.data,
        },
      };
    }

    case INSURER_REDUX_CONSTANTS.RESET_PAGE_DATA: {
      return {
        ...state,
        insurerList: {
          ...state?.insurerList,
          page: 1,
          limit: 15,
        },
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;

    default:
      return state;
  }
};
