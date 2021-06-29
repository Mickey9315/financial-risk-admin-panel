import {
  INSURER_COLUMN_LIST_REDUX_CONSTANTS,
  INSURER_CRM_REDUX_CONSTANTS,
  INSURER_REDUX_CONSTANTS,
  INSURER_VIEW_REDUX_CONSTANT,
} from './InsurerReduxConstants';

const initialInsurer = {
  insurerList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
    isLoading: true,
  },
  viewInsurerActiveTabIndex: 0,
  insurerColumnNameList: {},
  insurerDefaultColumnNameList: {},
  insurerViewData: {},
  syncInsurerWithCRM: [],
  contact: {
    contactList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    insurerContactColumnNameList: {},
    insurerContactDefaultColumnNameList: {},
  },
  policies: {
    policiesList: { docs: [], total: 1, limit: 15, page: 1, pages: 1 },
    insurerPoliciesColumnNameList: {},
    insurerPoliciesDefaultColumnNameList: {},
    policySyncList: [],
  },
  matrix: {
    generalGuideLines: [],
    priceRange: [],
  },
};

export const insurer = (state = initialInsurer, action) => {
  switch (action.type) {
    case INSURER_REDUX_CONSTANTS.INSURER_LIST_USER_SUCCESS_ACTION:
      return {
        ...state,
        insurerList: {
          ...action?.data,
          isLoading: false,
        },
      };

    case INSURER_REDUX_CONSTANTS.RESET_INSURER_LIST_PAGINATION_DATA:
      return {
        ...state,
        insurerList: {
          ...state?.insurerList,
          page: action?.page,
          limit: action?.limit,
          total: action?.total,
          pages: action?.pages,
        },
      };

    case INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_COLUMN_LIST_ACTION:
      return {
        ...state,
        insurerColumnNameList: action?.data,
      };
    case INSURER_COLUMN_LIST_REDUX_CONSTANTS.INSURER_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        insurerDefaultColumnNameList: action?.data,
      };

    case INSURER_COLUMN_LIST_REDUX_CONSTANTS.UPDATE_INSURER_COLUMN_LIST_ACTION: {
      const columnList = {
        ...state?.insurerColumnNameList,
      };
      const { type, name, value } = action?.data;
      columnList[`${type}`] = columnList?.[`${type}`]?.map(e =>
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
          insurerContactColumnNameList: action?.data,
        },
      };
    case INSURER_VIEW_REDUX_CONSTANT.CONTACT.INSURER_CONTACT_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        contact: {
          ...state?.contact,
          insurerContactDefaultColumnNameList: action?.data,
        },
      };
    case INSURER_VIEW_REDUX_CONSTANT.CONTACT.UPDATE_INSURER_CONTACT_COLUMN_LIST_ACTION: {
      const insurerContactColumnNameList = {
        ...state?.contact?.insurerContactColumnNameList,
      };
      const { type, name, value } = action?.data;
      insurerContactColumnNameList[`${type}`] = insurerContactColumnNameList?.[`${type}`]?.map(e =>
        e?.name === name ? { ...e, isChecked: value } : e
      );
      return {
        ...state,
        contact: {
          ...state?.contact,
          insurerContactColumnNameList,
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
          insurerPoliciesColumnNameList: action?.data,
        },
      };
    case INSURER_VIEW_REDUX_CONSTANT.POLICIES.INSURER_POLICIES_DEFAULT_COLUMN_LIST_ACTION:
      return {
        ...state,
        policies: {
          ...state?.policies,
          insurerPoliciesDefaultColumnNameList: action?.data,
        },
      };

    case INSURER_VIEW_REDUX_CONSTANT.POLICIES.UPDATE_POLICIES_CONTACT_COLUMN_LIST_ACTION: {
      const insurerPoliciesColumnNameList = {
        ...state?.policies?.insurerPoliciesColumnNameList,
      };

      const { type, name, value } = action?.data;

      insurerPoliciesColumnNameList[`${type}`] = insurerPoliciesColumnNameList?.[`${type}`]?.map(
        e =>
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
          insurerPoliciesColumnNameList,
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
    case INSURER_VIEW_REDUX_CONSTANT.VIEW_INSURER_ACTIVE_TAB_INDEX: {
      return {
        ...state,
        viewInsurerActiveTabIndex: action?.index,
      };
    }

    case INSURER_VIEW_REDUX_CONSTANT.RESET_INSURER_LIST_DATA: {
      return {
        ...state,
        insurerList: initialInsurer.insurerList,
      };
    }
    case INSURER_VIEW_REDUX_CONSTANT.RESET_VIEW_INSURER_DATA: {
      return {
        ...state,
        insurerViewData: initialInsurer.insurerViewData,
      };
    }

    default:
      return state;
  }
};
