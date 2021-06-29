import { GENERAL_LOADER_REDUX_CONSTANTS } from './GeneralLoaderReduxConstants';

export const generalLoaderReducer = (state = {}, action) => {
  switch (action.type) {
    case GENERAL_LOADER_REDUX_CONSTANTS.START_GENERAL_LOADER_ON_REQUEST:
      return { ...state, [`${action?.loaderFor}`]: true };
    case GENERAL_LOADER_REDUX_CONSTANTS.STOP_GENERAL_LOADER_ON_SUCCESS_OR_FAIL: {
      const temp = { ...state };
      delete temp[`${action?.loaderFor}`];

      return { ...temp };
    }
    default:
      return {
        ...state,
      };
  }
};
