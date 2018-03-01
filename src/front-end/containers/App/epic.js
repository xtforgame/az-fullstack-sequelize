import HeaderManager from '~/utils/HeaderManager';
import modelMap from './modelMap';

const {
  createSessionEpic,
  readSessionCollEpic,
  readUserEpic,
} = modelMap.epics;

const {
  SESSION_CREATE_SUCCESS,
  SESSION_CLEAR_START,
} = modelMap.types;

const {
  readUser,
} = modelMap.actions;

const fetchMyUserDataAfterPostedSession = (action$, store) =>
  action$.ofType(SESSION_CREATE_SUCCESS)
    .mergeMap(action => {
      // console.log('action :', action);
      HeaderManager.set('Authorization', `${action.data.token_type} ${action.data.token}`);
      return [
        readUser({}, {
          userId: action.data.userid,
        }),
      ];
    });

const clearAuthorizationHeaderAfterClearSession = (action$, store) =>
  action$.ofType(SESSION_CLEAR_START)
    .mergeMap(action => {
      HeaderManager.delete('Authorization');
      return [{ type: 'TO_BLACK_HOLE' }];
    });

export default [
  fetchMyUserDataAfterPostedSession,
  clearAuthorizationHeaderAfterClearSession,
  createSessionEpic,
  readSessionCollEpic,
  readUserEpic,
];
