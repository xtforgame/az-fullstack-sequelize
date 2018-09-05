import { Observable } from 'rxjs/Observable';
import {
  toNull,
} from 'reduxtful/core/helper-functions';

import modelMap from '../modelMap';
import {
  CHANGE_THEME,
  REQUEST_SAVE_USER_SETTING,
  SAVE_USER_SETTINGS,
} from '../constants';

import {
  requestSaveUserSetting,
  saveUserSettings,
} from '../actions';

const {
  patchUserSetting,
} = modelMap.waitableActions;

let unsavedUserSettings = {};
const requestSaveUserSettingEpic = (action$, store) => action$.ofType(REQUEST_SAVE_USER_SETTING)
    .mergeMap((action) => {
      unsavedUserSettings[action.userSettingType] = {
        ...unsavedUserSettings[action.userSettingType],
        ...action.data,
      };
      return [saveUserSettings()];
    });

const delaySaveUserSettingsEpic = (action$, store) => action$.ofType(SAVE_USER_SETTINGS)
    .debounceTime(250) // .auditTime(250)
    .switchMap(() => {
      const currentUnsavedUserSettings = unsavedUserSettings;
      unsavedUserSettings = {};
      const p = Promise.all(
        Object.keys(currentUnsavedUserSettings)
          .map(key => store.dispatch(patchUserSetting(key, currentUnsavedUserSettings[key])))
      );
      return Observable
        .fromPromise(p)
        .map(toNull)
        .catch((error) => {
          console.error('save user settings error :', error);
          Object.keys(currentUnsavedUserSettings)
            .forEach((key) => {
              unsavedUserSettings[key] = {
                ...currentUnsavedUserSettings[key],
                ...unsavedUserSettings[key],
              };
            });
          return [];
        });
    });

const saveUserSettingAfterChangeTheme = (action$, store) => action$.ofType(CHANGE_THEME)
    .mergeMap((action) => {
      if (action.saveToServer) {
        const { uiTheme } = action;
        return [requestSaveUserSetting('preference', { uiTheme })];
      }
      return [];
    });

export default [
  requestSaveUserSettingEpic,
  delaySaveUserSettingsEpic,
  saveUserSettingAfterChangeTheme,
];
