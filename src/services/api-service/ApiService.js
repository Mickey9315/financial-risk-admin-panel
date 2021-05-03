/* eslint-disable no-param-reassign */
import axios from 'axios';
import { store } from '../../redux/store';
import history from '../../routes/History';
import { getAuthTokenLocalStorage } from '../../helpers/LocalStorageHelper';
import { errorNotification } from '../../common/Toast';
import { LOGIN_REDUX_CONSTANTS } from '../../screens/auth/login/redux/LoginReduxConstants';

const instance = axios.create({
  timeout: 10000,
  params: {}, // do not remove this, its added to add params later in the config
});

// Add a request interceptor
instance.interceptors.request.use(
  async config => {
    const token = getAuthTokenLocalStorage();

    if (token) {
      config.headers.common.authorization = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    const statusCode = error?.response?.status ?? 0;
    switch (statusCode) {
      case 401:
        store.dispatch({
          type: LOGIN_REDUX_CONSTANTS.LOGOUT_USER_ACTION,
        });
        history.replace('/login');
        errorNotification('For security purposes you have been logged out, you need to re login');
        return false;
      case 403:
        history.replace('/forbidden-access');
        return false;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  request(config = {}) {
    return instance.request(config);
  },
  getData(url, config = {}) {
    return instance.get(url, config);
  },
  postData(url, data, config) {
    return instance.post(url, data, config);
  },
  putData(url, data, config) {
    return instance.put(url, data, config);
  },
  patchData(url, data) {
    return instance.patch(url, data);
  },
  deleteData(url, config = {}) {
    return instance.delete(url, config);
  },
};

export default ApiService;
