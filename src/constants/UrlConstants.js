export const BASE_URL = 'https://client.trad.dev.gradlesol.com/app/rp/';

export const AUTH_URLS = {
  LOGIN_URL: `${BASE_URL}auth/login/`,
  FORGOT_PASSWORD_URL: `${BASE_URL}auth/forget-password/`,
  VERIFY_OTP_URL: `${BASE_URL}auth/verify-otp/`,
  RESEND_OTP_URL: `${BASE_URL}auth/resend-otp/`,
  RESET_PASSWORD_URL: `${BASE_URL}auth/reset-password`,
};

export const HEADER_URLS = {
  LOGGED_USER_DETAILS_URL: `${BASE_URL}user/profile`,
  UPLOAD_PROFILE_PICTURE: `${BASE_URL}user/upload/profile-picture/`,
  CHANGE_PASSWORD_URL: `${BASE_URL}auth/change-password/`,
  LOGOUT_URL: `${BASE_URL}auth/logout/`,
};

export const USER_MANAGEMENT_URLS = {
  USER_LIST_URL: `${BASE_URL}user/`,
  USER_PRIVILEGES_URL: `${BASE_URL}privilege/`,
  SELECTED_USER_DETAILS_URL: `${BASE_URL}user/`,
  USER_COLUMN_NAME_LIST_URL: `${BASE_URL}user/column-name/`,
  USER_CLIENT_LIST_URL: `${BASE_URL}user/client-name/`,
  UPDATE_USER_COLUMN_NAME_LIST_URL: `${BASE_URL}user/column-name/`,
};

export const APPLICATION_URLS = {
  APPLICATION_LIST_URL: `${BASE_URL}application/`,
  APPLICATION_COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name?columnFor=application`,
  APPLICATION_COLUMN_NAME_LIST_UPDATE_URL: `${BASE_URL}application/column-name/`,

  COMPANY: {
    DROP_DOWN_DATA_URL: `${BASE_URL}application/entity-list/`,
    GET_DEBTOR_DETAILS: `${BASE_URL}debtor/entity-details/`,
  },
};

export const ORGANISATION_MODULE_URLS = {
  GET_ORGANIZATION_MODULE_LIST_URL: `${BASE_URL}organization/module`,
};

export const CLIENT_URLS = {
  CLIENT_LIST_URL: `${BASE_URL}client/`,
  CLIENT_BY_ID_URL: `${BASE_URL}client/`,
  CLIENT_COLUMN_NAME_LIST_URL: `${BASE_URL}client/column-name`,
  UPDATE_CLIENT_COLUMN_NAME_LIST_URL: `${BASE_URL}client/column-name`,
  CLIENT_FILTER_LIST_URL: `${BASE_URL}client/user-list`,
  SYNC_CLIENT_DATA_URL: `${BASE_URL}client/sync-from-crm/`,
  GET_DATA_FROM_CRM_URL: `${BASE_URL}client/search-from-crm`,

  CONTACT: {
    CONTACT_LIST: `${BASE_URL}client/user/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}client/user/column-name/`,
    SYNC_CLIENT_CONTACT_DATA_URL: `${BASE_URL}client/user/sync-from-crm/`,
  },

  POLICIES: {
    POLICIES_LIST: `${BASE_URL}policy/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}policy/column-name/`,
    SYNC_CLIENT_POLICIES_DATA_URL: `${BASE_URL}policy/client/sync-from-crm/`,
  },

  NOTES: {
    NOTES_LIST: `${BASE_URL}note/`,
  },
  DOCUMENTS: {
    DOCUMENTS_LIST: `${BASE_URL}document/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}document/column-name/`,
    GET_DOCUMENT_TYPE_URL: `${BASE_URL}settings/document-type/`,
  },
};

export const INSURER_URLS = {
  INSURER_LIST_URL: `${BASE_URL}insurer/`,
  SELECTED_INSURER_DETAILS_URL: `${BASE_URL}insurer/`,
  INSURER_COLUMN_NAME_LIST_URL: `${BASE_URL}insurer/column-name/`,
  UPDATE_INSURER_COLUMN_NAME_LIST_URL: `${BASE_URL}user/column-name/`,
  INSURER_LIST_BY_FILTER_URL: `${BASE_URL}insurer/filter/`,
};
