import { CLAIMS_REDUX_CONSTANTS } from './ClaimsReduxConstants';

const initialClaims = {
  claimsList: {
    docs: [],
    total: 1,
    limit: 15,
    page: 1,
    pages: 1,
    headers: [],
    isLoading: false,
  },

  claimsColumnList: {},
  claimsDefaultColumnList: {},

  claimsEntityList: [],
};

export const claims = (state = initialClaims, action) => {
  switch (action.type) {
    case CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_REQUEST:
      return {
        ...state,
        claimsList: {
          ...state?.claimsList,
          isLoading: true,
        },
      };

    case CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_SUCCESS:
      return {
        ...state,
        claimsList: {
          ...action?.data,
          isLoading: false,
        },
      };

    case CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_FAILURE:
      return {
        ...state,
        claimsList: {
          ...state?.claimsList,
          isLoading: false,
        },
      };

    case CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_COLUMNS_LIST:
      return {
        ...state,
        claimsColumnList: { ...action.data },
      };

    case CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_DEFAULT_COLUMN_LIST:
      return {
        ...state,
        claimsDefaultColumnList: { ...action.data },
      };

    case CLAIMS_REDUX_CONSTANTS.UPDATE_CLAIMS_COLUMNS_LIST: {
      const columnList = {
        ...state?.claimsColumnList,
      };
      const { type, name, value } = action?.data;
      columnList[type] = columnList[type].map(field =>
        field.name === name ? { ...field, isChecked: value } : field
      );
      return {
        ...state,
        claimsColumnList: columnList,
      };
    }

    case CLAIMS_REDUX_CONSTANTS.GET_CLAIMS_ENTITY_LIST: {
      const list = action.data.map(record => ({
        label: record.name,
        value: record._id,
      }));
      return {
        ...state,
        claimsEntityList: list,
      };
    }

    default:
      return state;
  }
};
