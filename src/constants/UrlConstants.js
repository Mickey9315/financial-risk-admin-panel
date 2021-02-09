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
  USER_LIST_URL: `${BASE_URL}rp/user`,
};
