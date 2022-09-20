export const enum ErrorCode {
  ERROR = 500,
  SUCCESS = 200,
  INVALID_PARAMS = 400,
  NOT_LOGGED_IN = 401,
  LOGIN_HAS_EXPIRED = 402,
  ERROR_USER_ALREADY_EXIST = 40001,
  ERROR_USER_NOT_EXIST = 40002,
  ERROR_USER_WRONG_PASSWORD = 40003,
  ERROR_USER_WRONG_ADMIN_PASSWORD = 40004,

  ERROR_BASE_MENU_NAME_ALREADY_EXIST = 40101,

  ERROR_AUTHORITY_ALREADY_EXIST = 40011,
}