const initialFilterState = {
  tempFilter: {},
  finalFilter: {},
};

export const LIST_FILTER_REDUCER_ACTIONS = {
  UPDATE_DATA: 'UPDATE_DATA',
  RESET_STATE: 'RESET_STATE',
  APPLY_DATA: 'APPLY_DATA',
  CLOSE_FILTER: 'CLOSE_FILTER',
};

export function filterReducer(state, action) {
  switch (action.type) {
    case LIST_FILTER_REDUCER_ACTIONS.UPDATE_DATA:
      return {
        ...state,
        tempFilter: {
          ...state.tempFilter,
          [`${action.name}`]: action.value,
        },
      };
    case LIST_FILTER_REDUCER_ACTIONS.APPLY_DATA:
      return {
        ...state,
        finalFilter: { ...state.tempFilter },
      };
    case LIST_FILTER_REDUCER_ACTIONS.CLOSE_FILTER:
      return {
        ...state,
        tempFilter: { ...state.finalFilter },
      };
    case LIST_FILTER_REDUCER_ACTIONS.RESET_STATE:
      return { ...initialFilterState };
    default:
      return state;
  }
}
