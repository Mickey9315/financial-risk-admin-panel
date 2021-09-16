import { LOGIN_REDUX_CONSTANTS } from '../../auth/login/redux/LoginReduxConstants';
import { OVERDUE_REDUX_CONSTANTS } from './OverduesReduxConstants';
import { FIELD_NAME_BY_ENTITY } from '../../../constants/EntitySearchConstants';

const initialOverdueState = {
  overdueList: {},
  entityList: {},
  overdueListByDate: {},
  overdueListByDateCopy: {},
  overdueDetails: {
    debtorId: [],
    acn: '',
    dateOfInvoice: '',
    overdueType: [],
    status: '',
    insurerId: [],
    monthString: '',
    clientComment: '',
    analystComment: '',
    currentAmount: '',
    thirtyDaysAmount: '',
    sixtyDaysAmount: '',
    ninetyDaysAmount: '',
    ninetyPlusDaysAmount: '',
    outstandingAmount: '',
  },
};

export const overdue = (state = initialOverdueState, action) => {
  switch (action.type) {
    case OVERDUE_REDUX_CONSTANTS?.GET_OVERDUE_LIST:
      return {
        ...state,
        overdueList: action?.data,
      };
    case OVERDUE_REDUX_CONSTANTS.GET_ENTITY_LIST: {
      const entityList = { ...state?.overdueDetails?.entityList };
      Object.entries(action?.data)?.forEach(([key, value]) => {
        entityList[key] = value?.map(entity => ({
          label: entity?.name,
          name: key,
          value: entity?._id,
          acn: entity?.acn,
        }));
      });
      return {
        ...state,
        entityList,
      };
    }

    case OVERDUE_REDUX_CONSTANTS.GET_OVERDUE_ENTITY_DATA_BY_SEARCH: {
      const entityName = FIELD_NAME_BY_ENTITY?.[action?.name];
      const entityList = {
        ...state?.entityList,
        [entityName]: action?.data?.map(entity => ({
          label: entity.name,
          name: entityName,
          value: entity._id,
        })),
      };

      return {
        ...state,
        entityList,
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_FIELD_VALUE:
      return {
        ...state,
        overdueDetails: {
          ...state?.overdueDetails,
          [action.name]: action.value,
        },
      };

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.RESET_OVERDUE_FORM_DATA:
      return {
        ...state,
        overdueDetails: initialOverdueState?.overdueDetails,
      };

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_LIST_BY_DATE: {
      const docs = action?.data?.docs?.map(doc => {
        return { ...doc };
      });
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          client: action?.data?.client,
          previousEntries: action?.data?.previousEntries,
          docs,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.COPY_OVERDUE_LIST_BY_DATE: {
      const docs = action?.data?.docs?.map(doc => {
        return { ...doc };
      });
      return {
        ...state,
        overdueListByDateCopy: {
          ...state?.overdueListByDateCopy,
          client: action?.data?.client,
          previousEntries: action?.data?.previousEntries,
          docs,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_BY_DATE: {
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: action.data.list,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_COPY_OVERDUE_LIST_BY_DATE: {
      return {
        ...state,
        overdueListByDateCopy: {
          ...state?.overdueListByDateCopy,
          docs: action.data.list,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.GET_OVERDUE_DETAILS: {
      const docs = state?.overdueListByDate?.docs;
      const overdueDetail = docs?.find(doc => doc?._id === action?.id);
      return {
        ...state,
        overdueDetails: overdueDetail,
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.CHANGE_OVERDUE_DETAILS_ACTION: {
      const finalDoc = state?.overdueListByDate?.docs?.map(doc => {
        if (doc?._id === action?.id) {
          return { ...doc, overdueAction: action?.status };
        }
        return doc;
      });
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: finalDoc,
        },
      };
    }
    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_AMEND: {
      const finalDoc = state?.overdueListByDate?.docs?.map(doc => {
        if (doc?._id === action?.id) {
          return { ...doc, ...action?.data, overdueAction: 'AMEND' };
        }
        return doc;
      });
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: finalDoc,
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.OVERDUE_CRUD_CONSTANTS.UPDATE_OVERDUE_LIST_AFTER_ADD: {
      return {
        ...state,
        overdueListByDate: {
          ...state?.overdueListByDate,
          docs: [...state?.overdueListByDate?.docs, action?.data],
        },
      };
    }

    case OVERDUE_REDUX_CONSTANTS.RESET_OVERDUE_LIST_PAGINATION_DATA: {
      return {
        ...state,
        overdueList: {
          ...state?.overdueList,
          page: action?.page,
          pages: action?.pages,
          total: action?.total,
          limit: action?.limit,
          docs: [],
        },
      };
    }

    case LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION:
      return null;
    default:
      return state;
  }
};
