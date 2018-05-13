import { Observable } from 'rxjs';
import HeaderManager from '~/utils/HeaderManager';
import modelMap from './modelMap';
import {
  SESSION_VERIFIED,
} from './constants';

import {
  sessionVerified,
} from './actions';

const {
  postSessionsEpic,
  getSessionsEpic,
  getUserEpic,
  postUsersEpic,
  patchUserEpic,
} = modelMap.epics;

const types = modelMap.types;

const {
  getUser,
  postSessions,
} = modelMap.actions;

const dispatchSessionVerifiedAfterPostedSession = (action$, store) =>
  action$.ofType(types.respondPostSessions)
    .mergeMap(action => {
      return [
        sessionVerified(action.data),
      ];
    });

const fetchMyUserDataAfterSessionVerified = (action$, store) =>
  action$.ofType(SESSION_VERIFIED)
    .mergeMap(action => {
      // console.log('action :', action);
      HeaderManager.set('Authorization', `${action.session.token_type} ${action.session.token}`);
      return [
        getUser(action.session.user_id),
      ];
    });

const clearAuthorizationHeaderAfterClearSession = (action$, store) =>
  action$.ofType(types.clearSessionCache)
    .mergeMap(action => {
      HeaderManager.delete('Authorization');
      return [{ type: 'TO_NULL' }];
    });

const autologinAfterRegistration = (action$, store) =>
  action$.ofType(types.postUsers)
    .switchMap((startAction) =>
      action$.ofType(types.respondPostUsers)
        .take(1) // don't listen forever! IMPORTANT!
        .switchMap(() => {
          return [postSessions(startAction.data.accountLinks[0])]; 
        })
    );

export default [
  dispatchSessionVerifiedAfterPostedSession,
  fetchMyUserDataAfterSessionVerified,
  clearAuthorizationHeaderAfterClearSession,
  autologinAfterRegistration,
  postSessionsEpic,
  getSessionsEpic,
  getUserEpic,
  postUsersEpic,
  patchUserEpic,
];
