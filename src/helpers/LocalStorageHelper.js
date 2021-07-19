import { SESSION_VARIABLES } from '../constants/SessionStorage';

export const AUTH_TOKEN = 'userToken';

export const saveAuthTokenLocalStorage = authToken => {
  SESSION_VARIABLES.USER_TOKEN = authToken;
  localStorage.setItem(AUTH_TOKEN, authToken);
};

// export const saveTokenToSession = authToken => {
//   sessionStorage.setItem(AUTH_TOKEN, authToken);
//   SESSION_VARIABLES.USER_TOKEN = authToken;
// };

// export const saveTokenFromLocalStorageToSession = () => {
//   const authToken = localStorage.getItem(AUTH_TOKEN);
//   if (authToken) {
//     SESSION_VARIABLES.USER_TOKEN = authToken;
//   }
// };

export const getAuthTokenLocalStorage = () => {
  // if (SESSION_VARIABLES.USER_TOKEN) {
  //   return SESSION_VARIABLES.USER_TOKEN;
  // }

  // const tokenFromSession = sessionStorage.getItem(AUTH_TOKEN);
  //
  // if (tokenFromSession) {
  //   SESSION_VARIABLES.USER_TOKEN = tokenFromSession;
  //   return tokenFromSession;
  // }
  return localStorage.getItem(AUTH_TOKEN);
};

export const clearAuthToken = () => {
  SESSION_VARIABLES.USER_TOKEN = null;
  sessionStorage.removeItem(AUTH_TOKEN);
  localStorage.removeItem(AUTH_TOKEN);
};
