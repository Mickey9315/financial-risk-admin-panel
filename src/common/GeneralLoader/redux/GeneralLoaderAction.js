import { GENERAL_LOADER_REDUX_CONSTANTS } from './GeneralLoaderReduxConstants';
import { store } from '../../../redux/store';

export const startGeneralLoaderOnRequest = loaderFor => {
  store.dispatch({
    type: GENERAL_LOADER_REDUX_CONSTANTS.START_GENERAL_LOADER_ON_REQUEST,
    loaderFor,
  });
};
export const stopGeneralLoaderOnSuccessOrFail = loaderFor => {
  store.dispatch({
    type: GENERAL_LOADER_REDUX_CONSTANTS.STOP_GENERAL_LOADER_ON_SUCCESS_OR_FAIL,
    loaderFor,
  });
};
