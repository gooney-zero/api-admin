import { ErrorCode } from './code';

export const MsgFlags = {
  [ErrorCode.SUCCESS]: 'ok',
  [ErrorCode.ERROR]: 'fail',
  [ErrorCode.INVALID_PARAMS]: '请求参数错误',
  [ErrorCode.NOT_LOGGED_IN]: '未登录',
  [ErrorCode.LOGIN_HAS_EXPIRED]: '登录已过期',
  [ErrorCode.ERROR_USER_ALREADY_EXIST]: '该用户已存在',
  [ErrorCode.ERROR_USER_NOT_EXIST]: '该用户不存在',
  [ErrorCode.ERROR_USER_WRONG_PASSWORD]: '用户名或密码错误',
  [ErrorCode.ERROR_USER_WRONG_ADMIN_PASSWORD]: '管理员密码错误',
  [ErrorCode.ERROR_USER_WRONG_UPDATE]: '更新用户信息失败',
  [ErrorCode.ERROR_USER_WRONG_DELETE_SELF]: '不能自杀',
  [ErrorCode.ERROR_USER_WRONG_DELETE_FAIL]: '删除失败',

  [ErrorCode.ERROR_BASE_MENU_NAME_ALREADY_EXIST]: 'name已存在',
  [ErrorCode.ERROR_BASE_MENU_NAME_NOTFOUND_PARENT]: '未找到父菜单',

  [ErrorCode.ERROR_AUTHORITY_ALREADY_EXIST]: '权限id已存在',
  [ErrorCode.ERROR_AUTHORITY_NOT_EXIST]: '权限id不存在',
  [ErrorCode.ERROR_AUTHORITY_WRONG_FAIL]: '更新权限失败',
  [ErrorCode.ERROR_AUTHORITY_WRONG_HAVE_USER_USEING]: '有用户正在使用此权限',
  [ErrorCode.ERROR_AUTHORITY_WRONG_ADD_MENY]: '添加菜单权限失败',
};
