export const BASE_URL = 'https://client.trad.dev.gradlesol.com/app/';

export const AUTH_URLS = {
  LOGIN_URL: `${BASE_URL}rp/auth/login/`,
  FORGOT_PASSWORD_URL: `${BASE_URL}rp/auth/forget-password/`,
  VERIFY_OTP_URL: `${BASE_URL}rp/auth/verify-otp/`,
  RESEND_OTP_URL: `${BASE_URL}rp/auth/resend-otp/`,
  RESET_PASSWORD_URL: `${BASE_URL}rp/auth/reset-password`,
};

export const HEADER_URLS = {
  CHANGE_PASSWORD_URL: `${BASE_URL}rp/auth/change-password/`,
  LOGOUT_URL: `${BASE_URL}rp/auth/logout/`,
};

export const USER_MANAGEMENT_URLS = {
  USER_LIST_URL: `${BASE_URL}rp/user/`,
  USER_COLUMN_NAME_LIST_URL: `${BASE_URL}rp/user/column-name/`,
  UPDATE_USER_COLUMN_NAME_LIST_URL: `${BASE_URL}rp/user/column-name/`,
  USER_LIST_BY_FILTER_URL: `${BASE_URL}rp/user/filter/`,
};

export const CLIENT_URLS = {
  CLIENT_LIST_URL: `${BASE_URL}rp/client`,
};
