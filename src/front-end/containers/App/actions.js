import {
  GREET,
  REMEMBER_ME,
  CHANGE_THEME,
  SESSION_VERIFIED,
  CLEAR_SENSITIVE_DATA,
} from './constants';

export const greet = (name) => ({ type: GREET, name });
export const rememberMe = (rememberUser) => ({ type: REMEMBER_ME, rememberUser });
export const changeTheme = (uiTheme) => ({ type: CHANGE_THEME, uiTheme });
export const sessionVerified = (session) => ({ type: SESSION_VERIFIED, session });
export const clearSensitiveData = () => ({ type: CLEAR_SENSITIVE_DATA });
