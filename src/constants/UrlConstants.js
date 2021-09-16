export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const AUTH_URLS = {
  LOGIN_URL: `${BASE_URL}auth/login/`,
  FORGOT_PASSWORD_URL: `${BASE_URL}auth/forget-password/`,
  VERIFY_OTP_URL: `${BASE_URL}auth/verify-otp/`,
  RESEND_OTP_URL: `${BASE_URL}auth/resend-otp/`,
  RESET_PASSWORD_URL: `${BASE_URL}auth/reset-password`,
  SET_PASSWORD_URL: `${BASE_URL}auth/set-password`,
};

export const HEADER_URLS = {
  LOGGED_USER_DETAILS_URL: `${BASE_URL}profile/`,
  UPLOAD_PROFILE_PICTURE: `${BASE_URL}profile/upload/`,
  CHANGE_PASSWORD_URL: `${BASE_URL}auth/change-password/`,
  LOGOUT_URL: `${BASE_URL}auth/logout/`,
  HEADER_NOTIFICATIONS: {
    GET_HEADER_NOTIFICATION_LIST_URL: `${BASE_URL}notification/list/`,
    MARK_AS_READ_NOTIFICATION_URL: `${BASE_URL}notification/markAsRead/`,
    NOTIFICATION_ALERTS_DETAILS: `${BASE_URL}notification/alert/`,
    MARK_ALL_NOTIFICATIONS_AS_READ: `${BASE_URL}notification/markAllAsRead/`,
  },
  HEADER_GLOBAL_SEARCH: `${BASE_URL}search/`,
};

export const DASHBOARD_URLS = {
  DASHBOARD_DETAILS: `${BASE_URL}dashboard`,
  DASHBOARD_USER_LIST: `${BASE_URL}dashboard/user-list`,
};

export const USER_MANAGEMENT_URLS = {
  USER_LIST_URL: `${BASE_URL}user/`,
  USER_PRIVILEGES_URL: `${BASE_URL}privilege/`,
  SELECTED_USER_DETAILS_URL: `${BASE_URL}user/`,
  USER_COLUMN_NAME_LIST_URL: `${BASE_URL}user/column-name/`,
  USER_CLIENT_LIST_URL: `${BASE_URL}user/client-name/`,
  UPDATE_USER_COLUMN_NAME_LIST_URL: `${BASE_URL}user/column-name/`,
  RESEND_MAIL: `${BASE_URL}user/send-mail/`,
};

export const APPLICATION_URLS = {
  APPLICATION_LIST_URL: `${BASE_URL}application/`,
  APPLICATION_COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name?columnFor=application`,
  APPLICATION_COLUMN_NAME_LIST_UPDATE_URL: `${BASE_URL}application/column-name/`,
  APPLICATION_SAVE_STEP_DATA: `${BASE_URL}application/`,
  APPLICATION_FILTER_LIST_URL: `${BASE_URL}application/entity-list`,
  GET_APPLICATION_DETAILS_URL: `${BASE_URL}application/details/`,
  DOWNLOAD_APPLICATION: `${BASE_URL}application/download`,
  APPLICATION_SEARCH_DEBTOR_DROPDOWN_DATA: `${BASE_URL}application/debtor-list`,

  COMPANY: {
    DROP_DOWN_DATA_URL: `${BASE_URL}application/entity-list/`,
    SEARCH_APPLICATION_BY_DEBTOR_DETAILS: `${BASE_URL}debtor/details/`,
    SEARCH_APPLICATION_BY_ABN_ACN_DETAILS: `${BASE_URL}application/search-entity/`,
    SEARCH_APPLICATION_ENTITY_TYPE: `${BASE_URL}application/search-entity-list/`,
    DELETE_APPLICATION_PERSONS: `${BASE_URL}debtor/stakeholder/`,
  },
  DOCUMENTS: {
    GET_DOCUMENT_TYPE_LIST_URL: `${BASE_URL}settings/document-type/`,
    UPLOAD_DOCUMENT_URL: `${BASE_URL}document/upload/`,
    APPLICATION_DELETE_DOCUMENT: `${BASE_URL}document/`,
  },

  // View Application
  VIEW_APPLICATION: {
    CHANGE_APPLICATION_STATUS: `${BASE_URL}application/`,
    APPLICATION_TASK: {
      GET_TASK_LIST: `${BASE_URL}task/`,
      ASSIGNEE_DROP_DOWN_DATA: `${BASE_URL}task/user-list/`,
      ENTITY_DROP_DOWN_DATA: `${BASE_URL}task/entity-list/`,
      GET_APPLICATION_TASK_DETAIL: `${BASE_URL}task/details/`,
      SAVE_NEW_TASK: `${BASE_URL}task/`,
    },
    APPLICATION_MODULES: {
      GET_MODULE_LIST: `${BASE_URL}application/modules/`,
      GET_DOCUMENT_TYPE_LIST_URL: `${BASE_URL}settings/document-type-list/`,
      UPLOAD_DOCUMENT_URL: `${BASE_URL}document/upload/`,
      DELETE_DOCUMENT_URL: `${BASE_URL}document/`,
    },
    DOWNLOAD_DOCUMENTS_URL: `${BASE_URL}document/download`,
    APPLICATION_NOTES: {
      GET_NOTES_LIST: `${BASE_URL}note/`,
    },
    APPLICATION_REPORTS: {
      APPLICATION_REPORTS_LIST: `${BASE_URL}credit-report/`,
      APPLICATION_REPORTS_LIST_FOR_FETCH: `${BASE_URL}credit-report/list/`,
      FETCH_SELECTED_REPORTS_FOR_APPLICATION: `${BASE_URL}credit-report/generate/`,
      DOWNLOAD_REPORTS_FOR_APPLICATION: `${BASE_URL}credit-report/download/`,
    },
    APPLICATION_ALERTS: {
      APPLICATION_ALERTS_LIST: `${BASE_URL}application/alert-list/`,
      ALERTS_DETAILS: `${BASE_URL}application/alert/`,
    },
  },
  // import application
  IMPORT_APPLICATION_URLS: {
    DOWNLOAD_SAMPLE: `${BASE_URL}import-application-dump/sample-file/`,
    UPLOAD_DUMP: `${BASE_URL}import-application-dump/`,
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
  DOWNLOAD_CLIENTS: `${BASE_URL}client/download/`,

  CREDIT_LIMIT: {
    CREDIT_LIMIT_LIST: `${BASE_URL}client/credit-limit/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}client/credit-limit/column-name/`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}client/credit-limit/column-name/`,
    CREDIT_LIMIT_ACTIONS: `${BASE_URL}client/credit-limit/`,
    DOWNLOAD_CLIENT_CREDIT_LIMIT_CSV: `${BASE_URL}client/download/`,
    DOWNLOAD_CLIENT_CREDIT_LIMIT_DECISION_LETTER: `${BASE_URL}client/download/decision-letter/`,
  },

  APPLICATION: {
    APPLICATION_LIST: `${BASE_URL}application/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name/`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name/`,
  },

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
    GET_DOCUMENT_TYPE_URL: `${BASE_URL}settings/document-type-list/`,
    UPLOAD_DOCUMENT_URL: `${BASE_URL}document/upload/`,
    DOWNLOAD_DOCUMENTS_URL: `${BASE_URL}document/download`,
  },
  TASK: {
    TASK_LIST_URL: `${BASE_URL}task/`,
    TASK_COLUMN_NAME_LIST_URL: `${BASE_URL}task/column-name`,
    ADD_TASK: {
      ASSIGNEE_DROP_DOWN_DATA: `${BASE_URL}task/user-list/`,
      ENTITY_DROP_DOWN_DATA: `${BASE_URL}task/entity-list/`,
      SAVE_NEW_TASK: `${BASE_URL}task/`,
    },
    EDIT_TASK: {
      GET_CLIENT_TASK_DETAIL: `${BASE_URL}task/details/`,
    },
  },
  CLIENT_OVERDUE: {
    GET_CLIENT_OVERDUE_LIST: `${BASE_URL}overdue/`,
    GET_CLIENT_CLAIMS_ENTITY_LIST: `${BASE_URL}overdue/entity-list/`,
  },
  CLIENT_CLAIMS: {
    CLIENT_CLAIMS_LIST: `${BASE_URL}claim/`,
    CLIENT_CLAIMS_COLUMN_LIST: `${BASE_URL}claim/column-name/`,
    UPDATE_CLIENT_CLAIMS_COLUMN_LIST: `${BASE_URL}claim/column-name/`,
  },
};

export const INSURER_URLS = {
  INSURER_LIST_URL: `${BASE_URL}insurer/`,
  SELECTED_INSURER_DETAILS_URL: `${BASE_URL}insurer/`,
  INSURER_COLUMN_NAME_LIST_URL: `${BASE_URL}insurer/column-name`,
  UPDATE_INSURER_COLUMN_NAME_LIST_URL: `${BASE_URL}insurer/column-name`,
  INSURER_LIST_BY_FILTER_URL: `${BASE_URL}insurer/filter/`,
  GET_DATA_FROM_CRM_URL: `${BASE_URL}insurer/search-from-crm`,
  ADD_DATA_FROM_CRM_URL: `${BASE_URL}insurer`,
  SYNC_DATA_WITH_CRM_URL: `${BASE_URL}insurer/sync-from-crm/`,

  CONTACT: {
    CONTACT_LIST: `${BASE_URL}insurer/user/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}insurer/user/column-name`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}insurer/user/column-name`,
    SYNC_CONTACT_LIST_URL: `${BASE_URL}insurer/user/sync-from-crm/`,
  },
  POLICIES: {
    POLICIES_LIST: `${BASE_URL}policy/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}policy/column-name/`,
    SYNC_CLIENT_POLICIES_DATA_URL: `${BASE_URL}policy/sync-from-crm/`,
    SYNC_LIST_BY_SEARCH: `${BASE_URL}insurer/client-list/`,
  },

  MATRIX: {
    MATRIX_DATA: `${BASE_URL}insurer/matrix/`,
  },
};

export const DEBTORS_URLS = {
  DEBTORS_LIST_URL: `${BASE_URL}debtor/`,
  DEBTORS_COLUMNS_NAME_LIST_URL: `${BASE_URL}debtor/column-name/`,
  SELECTED_DEBTOR_DETAILS_URL: `${BASE_URL}debtor/`,
  DROP_DOWN_DATA_URL: `${BASE_URL}debtor/entity-list/`,
  DOWNLOAD_DEBTOR: `${BASE_URL}debtor/download/`,

  NOTES: {
    NOTES_LIST: `${BASE_URL}note/`,
  },
  DOCUMENTS: {
    DOCUMENTS_LIST: `${BASE_URL}document/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}document/column-name/`,
    GET_DOCUMENT_TYPE_URL: `${BASE_URL}settings/document-type-list/`,
    UPLOAD_DOCUMENT_URL: `${BASE_URL}document/upload/`,
    DOWNLOAD_DOCUMENTS_URL: `${BASE_URL}document/download`,
  },
  TASK: {
    TASK_LIST_URL: `${BASE_URL}task/`,
    TASK_COLUMN_NAME_LIST_URL: `${BASE_URL}task/column-name`,
    ADD_TASK: {
      ASSIGNEE_DROP_DOWN_DATA: `${BASE_URL}task/user-list/`,
      ENTITY_DROP_DOWN_DATA: `${BASE_URL}task/entity-list/`,
      SAVE_NEW_TASK: `${BASE_URL}task/`,
    },
    EDIT_TASK: {
      GET_DEBTOR_TASK_DETAIL: `${BASE_URL}task/details/`,
    },
  },
  APPLICATION: {
    APPLICATION_LIST: `${BASE_URL}application/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name/`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}application/column-name/`,
  },

  ALERTS: {
    ALERTS_LIST: `${BASE_URL}debtor/alert-list/`,
    ALERTS_DETAILS: `${BASE_URL}debtor/alert/`,
  },
  CREDIT_LIMIT: {
    CREDIT_LIMIT_LIST: `${BASE_URL}debtor/credit-limit/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}debtor/column-name/`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}debtor/column-name/`,
    CREDIT_LIMIT_ACTIONS: `${BASE_URL}debtor/credit-limit/`,
    DOWNLOAD_DEBTOR_CREDIT_LIMIT_CSV: `${BASE_URL}debtor/download/`,
    DOWNLOAD_DEBTOR_CREDIT_LIMIT_DECISION_LETTER: `${BASE_URL}debtor/download/decision-letter/`,
  },
  STAKE_HOLDER: {
    STAKE_HOLDER_LIST: `${BASE_URL}debtor/stakeholder/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}debtor/column-name/`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}debtor/column-name/`,
    STAKE_HOLDER_CRUD: {
      GET_STAKE_HOLDER_DETAIL: `${BASE_URL}debtor/stakeholder-details/`,
      DROP_DOWN_DATA_URL: `${BASE_URL}debtor/entity-list/`,
      SEARCH_APPLICATION_BY_DEBTOR_DETAILS: `${BASE_URL}debtor/details/`,
      SEARCH_APPLICATION_BY_ABN_ACN_DETAILS: `${BASE_URL}debtor/search-entity/`,
      SEARCH_APPLICATION_ENTITY_TYPE: `${BASE_URL}debtor/search-entity-list/`,
      SAVE_NEW_STAKE_HOLDER: `${BASE_URL}debtor/stakeholder/`,
      DELETE_STAKE_HOLDER: `${BASE_URL}debtor/stakeholder/`,
    },
  },
  REPORTS: {
    DEBTOR_REPORTS_LIST: `${BASE_URL}credit-report/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}credit-report/column-name/`,
    UPDATE_COLUMN_NAME_LIST_URL: `${BASE_URL}credit-report/column-name/`,
    DEBTOR_REPORTS_LIST_FOR_FETCH: `${BASE_URL}credit-report/list/`,
    FETCH_SELECTED_REPORTS_FOR_DEBTOR: `${BASE_URL}credit-report/generate/`,
    DOWNLOAD_REPORTS_FOR_DEBTOR: `${BASE_URL}credit-report/download/`,
  },
  DEBTOR_OVERDUE: {
    GET_DEBTOR_OVERDUE_LIST: `${BASE_URL}overdue/`,
    GET_DEBTOR_OVERDUE_ENTITY_LIST: `${BASE_URL}overdue/entity-list/`,
  },
};

export const CLAIMS_URLS = {
  CLAIMS_LIST: `${BASE_URL}claim/`,
  CLAIMS_COLUMN_LIST: `${BASE_URL}claim/column-name/`,
  UPDATE_CLAIMS_COLUMN_LIST: `${BASE_URL}claim/column-name/`,
  GET_CLAIMS_ENTITY_LIST: `${BASE_URL}claim/entity-list`,
  ADD_CLAIM: `${BASE_URL}claim/`,
  GET_CLAIM_DETAILS: `${BASE_URL}claim/`,
  DOCUMENTS: {
    DOCUMENTS_LIST: `${BASE_URL}claim/document/`,
    DOWNLOAD_DOCUMENTS: `${BASE_URL}claim/document/download/`,
  },
};

export const REPORTS_URLS = {
  GET_REPORTS_LIST: `${BASE_URL}report`,
  GET_REPORTS_COLUMN_LIST: `${BASE_URL}report/column-name`,
  UPDATE_REPORTS_COLUMN_LIST: `${BASE_URL}report/column-name`,
  GET_REPORT_CLIENT_LIST: `${BASE_URL}report/entity-list`,
  DOWNLOAD_REPORT: `${BASE_URL}report/download`,
};

export const MY_WORK_URL = {
  TASK: {
    TASK_LIST_URL: `${BASE_URL}task/`,
    ASSIGNEE_DROP_DOWN_DATA: `${BASE_URL}task/user-list/`,
    ENTITY_DROP_DOWN_DATA: `${BASE_URL}task/entity-list/`,
    SAVE_NEW_TASK: `${BASE_URL}task/`,
    COLUMN_NAME_LIST_URL: `${BASE_URL}task/column-name/`,
    TASK_DETAIL_BY_ID_URL: `${BASE_URL}task/details/`,
    UPDATE_TASK: `${BASE_URL}task/`,
  },
  MY_WORK_NOTIFICATION: {
    MY_WORK_NOTIFICATION_LIST: `${BASE_URL}notification/`,
    MY_WORK_DELETE_NOTIFICATION: `${BASE_URL}notification/`,
  },
};

export const SETTING_URL = {
  DOCUMENT_TYPE: {
    DOCUMENT_TYPE_LIST: `${BASE_URL}settings/document-type/`,
    ADD_NEW_DOCUMENT_TYPE_LIST: `${BASE_URL}settings/document-type/`,
    GET_DOCTYPE_DETAIL: `${BASE_URL}settings/document-type-details/`,
    UPDATE_DOCUMENT_BY_ID: `${BASE_URL}settings/document-type/`,
    DELETE_DOCUMENT_BY_ID: `${BASE_URL}settings/document-type/`,
  },
  ORGANIZATION_DETAILS: {
    GET_ORGANIZATION_DETAILS: `${BASE_URL}settings/origination-details/`,
    UPDATE_ORGANIZATION_DETAILS: `${BASE_URL}settings/origination-details/`,
  },
  API_INTEGRATION: {
    GET_API_INTEGRATION: `${BASE_URL}settings/api-integration/`,
    UPDATE_API_INTEGRATION: `${BASE_URL}settings/api-integration/`,
    TEST_API_INTEGRATION: `${BASE_URL}settings/test-credentials/`,
  },
  AUDIT_LOG: {
    GET_AUDIT_LOG_LIST: `${BASE_URL}settings/audit-logs/`,
    GET_AUDIT_LOG_COLUMN_LIST_NAME: `${BASE_URL}settings/column-name/`,
    UPDATE_AUDIT_LOG_COLUMN_NAME_LIST: `${BASE_URL}settings/column-name/`,
    GET_AUDIT_USER_TYPE_LIST: `${BASE_URL}settings/user-list/`,
  },
};

export const OVERDUE_URLS = {
  GET_OVERDUE_LIST: `${BASE_URL}overdue/`,
  GET_OVERDUE_LIST_BY_DATE: `${BASE_URL}overdue/list/`,
  GET_ENTITY_LIST: `${BASE_URL}overdue/entity-list/`,
  CHANGE_OVERDUE_STATUS: `${BASE_URL}overdue/status/`,
  SAVE_OVERDUE_LIST: `${BASE_URL}overdue/list/`,
};
