import {
  GREET,
  REMEMBER_ME,
  CHANGE_THEME,
} from './constants';

export const greet = (name) => ({ type: GREET, name });
export const rememberMe = (rememberUser) => ({ type: REMEMBER_ME, rememberUser });
export const changeTheme = (uiTheme) => ({ type: CHANGE_THEME, uiTheme });
