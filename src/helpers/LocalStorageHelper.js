import { SESSION_STORAGE } from '../constants/SessionStorage';

export const AUTH_TOKEN = 'userToken';

export const saveAuthTokenLocalStorage = authToken => {
  SESSION_STORAGE.USER_TOKEN = authToken;
  localStorage.setItem(AUTH_TOKEN, authToken);
};

export const saveTokenToSession = authToken => {
  SESSION_STORAGE.USER_TOKEN = authToken;
};

export const saveTokenFromLocalStorageToSession = () => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  if (authToken) {
    SESSION_STORAGE.USER_TOKEN = authToken;
  }
};

export const getAuthTokenLocalStorage = () => {
  if (SESSION_STORAGE.USER_TOKEN) {
    return SESSION_STORAGE.USER_TOKEN;
  }
  return localStorage.getItem(AUTH_TOKEN);
};

export const clearAuthToken = () => {
  SESSION_STORAGE.USER_TOKEN = null;
  localStorage.removeItem(AUTH_TOKEN);
};
