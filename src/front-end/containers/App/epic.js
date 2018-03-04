import HeaderManager from '~/utils/HeaderManager';
import modelMap from './modelMap';

const {
  createSessionEpic,
  readSessionCollEpic,
  readUserEpic,
  createUserEpic,
} = modelMap.epics;

const {
  SESSION_CREATE_SUCCESS,
  SESSION_CLEAR_START,
} = modelMap.types;

const {
  readUser,
  createUser,
} = modelMap.actions;

const fetchMyUserDataAfterPostedSession = (action$, store) =>
  action$.ofType(SESSION_CREATE_SUCCESS)
    .mergeMap(action => {
      // console.log('action :', action);
      HeaderManager.set('Authorization', `${action.data.token_type} ${action.data.token}`);
      return [
        createUser({
          name: 'Test User',
          privilege: 'admin',
          accountLinks: [{
            auth_type: 'basic',
            username: 'testuser',
            password: 'testuser',
          }],
        },
        {}),
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
  createUserEpic,
  readUserEpic,
];
