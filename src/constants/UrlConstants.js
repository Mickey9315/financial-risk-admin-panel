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
  SELECTED_USER_DETAILS_URL: `${BASE_URL}rp/user/`,
  USER_COLUMN_NAME_LIST_URL: `${BASE_URL}rp/user/column-name/`,
  USER_CLIENT_LIST_URL: `${BASE_URL}rp/user/client-name/`,
  UPDATE_USER_COLUMN_NAME_LIST_URL: `${BASE_URL}rp/user/column-name/`,
};

export const ORGANISATION_MODULE_URLS = {
  GET_ORGANIZATION_MODULE_LIST_URL: `${BASE_URL}rp/organization/module`,
};

export const CLIENT_URLS = {
  CLIENT_LIST_URL: `${BASE_URL}rp/client/`,
  CLIENT_BY_ID_URL: `${BASE_URL}rp/client/`,
};

export const INSURER_URLS = {
  INSURER_LIST_URL: `${BASE_URL}rp/insurer/`,
  SELECTED_INSURER_DETAILS_URL: `${BASE_URL}rp/insurer/`,
  INSURER_COLUMN_NAME_LIST_URL: `${BASE_URL}rp/insurer/column-name/`,
  UPDATE_INSURER_COLUMN_NAME_LIST_URL: `${BASE_URL}rp/user/column-name/`,
  INSURER_LIST_BY_FILTER_URL: `${BASE_URL}rp/insurer/filter/`,
};
