import { LOADER_BUTTON_REDUX_CONSTANTS } from './LoaderButtonReduxConstants';

export const loaderButtonReducer = (state = {}, action) => {
  switch (action.type) {
    case LOADER_BUTTON_REDUX_CONSTANTS.START_LOADER_BUTTON_ON_REQUEST:
      return { ...state, [`${action?.loaderFor}`]: true };
    case LOADER_BUTTON_REDUX_CONSTANTS.STOP_LOADER_BUTTON_ON_SUCCESS_OR_FAIL: {
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
