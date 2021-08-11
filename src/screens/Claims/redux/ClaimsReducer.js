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
  claimDetails: {},

  documents: {
    documentList: [],
  },
};

export const claims = (state = initialClaims, action) => {
  switch (action.type) {
    case CLAIMS_REDUX_CONSTANTS.CLAIMS_LIST_SUCCESS:
      return {
        ...state,
        claimsList: {
          ...action?.data,
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
        value: record?.crmClientId,
      }));
      return {
        ...state,
        claimsEntityList: list,
      };
    }

    case CLAIMS_REDUX_CONSTANTS.ADD_CLAIMS_VALUE_CHANGE: {
      return {
        ...state,
        claimDetails: {
          ...state?.claimDetails,
          [action.name]: action.value,
        },
      };
    }

    case CLAIMS_REDUX_CONSTANTS.GET_CLAIM_DETAILS: {
      return {
        ...state,
        claimDetails: action.data,
      };
    }

    case CLAIMS_REDUX_CONSTANTS.RESET_CLAIMS_DETAILS: {
      return {
        ...state,
        claimDetails: {},
      };
    }

    case CLAIMS_REDUX_CONSTANTS.RESET_CLAIM_LIST_DATA: {
      return {
        ...state,
        claimsList: initialClaims.claimsList,
      };
    }

    case CLAIMS_REDUX_CONSTANTS.DOCUMENTS.FETCH_CLAIMS_DOCUMENTS_LIST:
      return {
        ...state,
        documents: {
          ...state?.documents,
          documentList: action.data,
        },
      };

    default:
      return state;
  }
};
