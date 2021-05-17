import { LOADER_BUTTON_REDUX_CONSTANTS } from './LoaderButtonReduxConstants';
import { store } from '../../../redux/store';

export const startLoaderButtonOnRequest = loaderFor => {
  store.dispatch({
    type: LOADER_BUTTON_REDUX_CONSTANTS.START_LOADER_BUTTON_ON_REQUEST,
    loaderFor,
  });
};
export const stopLoaderButtonOnSuccessOrFail = loaderFor => {
  store.dispatch({
    type: LOADER_BUTTON_REDUX_CONSTANTS.STOP_LOADER_BUTTON_ON_SUCCESS_OR_FAIL,
    loaderFor,
  });
};
