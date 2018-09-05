import { Observable } from 'rxjs/Observable';
import HeaderManager from '~/utils/HeaderManager';
import modelMap from '../modelMap';
import {
  SESSION_VERIFIED,
} from '../constants';

import {
  sessionVerified,
  userLoaded,
  failToLoadUser,
  clearSensitiveData,
  changeTheme,
} from '../actions';

const { types } = modelMap;

const {
  getUser,
  getUserSettings,
  postSessions,
} = modelMap.waitableActions;

const dispatchSessionVerifiedAfterPostedSession = (action$, store) => action$.ofType(types.respondPostSessions)
    .mergeMap(action => [
      sessionVerified(action.data),
    ]);

const fetchDataAfterSessionVerified = (action$, store) => action$.ofType(SESSION_VERIFIED)
    .mergeMap((action) => {
      HeaderManager.set('Authorization', `${action.session.token_type} ${action.session.token}`);
      return Observable.combineLatest(
        Observable.fromPromise(store.dispatch(getUser(action.session.user_id))),
        Observable.fromPromise(store.dispatch(getUserSettings()))
      )
      .mergeMap(([_, action]) => action.data
        .filter(setting => setting.type === 'preference' && setting.data)
        .map(setting => changeTheme(setting.data.uiTheme, false))
        .concat([userLoaded()]))
      .catch((error) => {
        console.error('fetch data failed :', error);
        return [failToLoadUser(error)];
      });
    });

const clearAuthorizationHeaderAfterClearSession = (action$, store) => action$.ofType(types.clearSessionCache)
    .mergeMap((action) => {
      HeaderManager.delete('Authorization');
      return [
        clearSensitiveData(),
      ];
    });

const autologinAfterRegistration = (action$, store) => action$.ofType(types.postUsers)
    .switchMap(startAction => action$.ofType(types.respondPostUsers)
        .take(1) // don't listen forever! IMPORTANT!
        .switchMap(() => [postSessions(startAction.data.accountLinks[0])]));

export default [
  dispatchSessionVerifiedAfterPostedSession,
  fetchDataAfterSessionVerified,
  clearAuthorizationHeaderAfterClearSession,
  autologinAfterRegistration,
];
