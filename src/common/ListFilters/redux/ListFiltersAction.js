import { LIST_FILTERS_REDUX_CONSTANTS } from './ListFiltersReduxConstants';

export const saveAppliedFilters = (filterFor, filters) => {
  return dispatch => {
    dispatch({
      type: LIST_FILTERS_REDUX_CONSTANTS.SAVE_APPLIED_FILTERS,
      filterFor,
      filters,
    });
  };
};
