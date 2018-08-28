import { getHeaders } from '~/utils/HeaderManager';
import {
  ModelMap,
  defaultExtensions,
} from 'reduxtful';

import SelectorsCreator from 'reduxtful/extensions/SelectorsCreator';
import EpicCreator from 'reduxtful/extensions/EpicCreator';
import WaitableActionsCreator from 'reduxtful/extensions/WaitableActionsCreator';


import axios from 'axios';
import { Observable } from 'rxjs/Observable';
import { createSelector } from 'reselect';

const responseMiddleware = (response, info, next) => {
  if (response.status === 200 && response.data.error) {
    // for some error carried by a 200 response
    return Promise.reject(response.data.error);
  }
  return next();
};

const epics = {
  axios,
  Observable,
  getHeaders,
  middlewares: {
    response: [responseMiddleware],
  },
};

const modelsDefine = {
  api: {
    url: './api',
    names: { model: 'api', member: 'api', collection: 'apis' },
    singleton: true,
    config: {
      // actionNoRedundantBody: true,
      getId: data => 'api', // data.user_id,
    },
    extensionConfigs: {
      epics,
    },
  },
  sessions: {
    url: './api/sessions',
    names: { model: 'session', member: 'session', collection: 'sessions' },
    config: {
      // actionNoRedundantBody: true,
      getId: data => 'me', // data.user_id,
    },
    extensionConfigs: {
      epics,
      selectors: {
        createSelector,
        baseSelector: state => state.get('global').sessions,
      },
    },
  },
  users: {
    url: './api/users',
    names: { model: 'user', member: 'user', collection: 'users' },
    config: {
      // actionNoRedundantBody: true,
      getId: data => data.id,
    },
    extensionConfigs: {
      epics,
      selectors: {
        createSelector,
        baseSelector: state => state.get('global').users,
      },
    },
  },
  recoveryTokens: {
    url: './api/recoveryTokens',
    names: { model: 'recoveryToken', member: 'recoveryToken', collection: 'recoveryTokens' },
    config: {
      // actionNoRedundantBody: true,
      getId: data => 'current',
    },
    extensionConfigs: {
      epics,
      selectors: {
        createSelector,
        baseSelector: state => state.get('global').recoveryTokens,
      },
    },
  },
  challengeRecoveryTokens: {
    url: './api/challengeRecoveryTokens',
    names: { model: 'challengeRecoveryToken', member: 'challengeRecoveryToken', collection: 'challengeRecoveryTokens' },
    config: {
      // actionNoRedundantBody: true,
      getId: data => 'current',
    },
    extensionConfigs: {
      epics,
      selectors: {
        createSelector,
        baseSelector: state => state.get('global').challengeRecoveryTokens,
      },
    },
  },
  resetPasswordRequests: {
    url: './api/resetPasswordRequests',
    names: { model: 'resetPasswordRequest', member: 'resetPasswordRequest', collection: 'resetPasswordRequests' },
    config: {
      // actionNoRedundantBody: true,
      getId: data => 'current',
    },
    extensionConfigs: {
      epics,
      selectors: {
        createSelector,
        baseSelector: state => state.get('global').resetPasswordRequests,
      },
    },
  },
};

const modelMap = new ModelMap('global', modelsDefine, defaultExtensions.concat([SelectorsCreator, EpicCreator, WaitableActionsCreator]));
export default modelMap;
