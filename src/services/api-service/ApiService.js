/* eslint-disable no-param-reassign */
import axios from 'axios';
import { clearAuthToken, getAuthTokenLocalStorage } from '../../helpers/LocalStorageHelper';
import { errorNotification } from '../../common/Toast';

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
    if (error.response.status === 401) {
      clearAuthToken();
      errorNotification('For security purposes you have been logged out, you need to re login');
      window.location.href = '/login';
      return false;
    }
    if (error.response.status === 403) {
      window.location.href = '/forbidden-access';
      return false;
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
