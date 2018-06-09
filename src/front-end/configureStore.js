import { compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import { routerMiddleware } from 'react-router-redux';
import { Map as ImmutableMap } from 'immutable';

import { configureStore } from 'rrw-module';
import RrwExEpic from 'rrw-module/extensions/epic';
import createReduxWaitForMiddleware from 'redux-wait-for-action';

import languageProviderReducer from '~/containers/LanguageProvider/reducer';

import {
  CLEAR_SENSITIVE_DATA,
} from '~/containers/App/constants';
import appReducer from '~/containers/App/reducer';
import appEpic from '~/containers/App/epic';

import { middleware as localStorageMiddleware } from './localStorage';

const staticReducers = {
  global: appReducer,
  router: routerReducer,
  language: languageProviderReducer,
};

let composeEnhancers = undefined;

if(process.env.NODE_ENV === 'development'){
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

export default (initialState, history) => configureStore(staticReducers, ImmutableMap(initialState), {
  reducerOptions: {
    createRootReducer: ((rootReducer) => (state, action) => {
      if (action.type === CLEAR_SENSITIVE_DATA) {
        // leave keys belong to staticReducers after logout
        state = state.filter((v, k) => staticReducers[k] !== undefined);
        state = state.update('global', v => { persistence: v.persistence });
      }

      return rootReducer(state, action);
    }),
  },
  extensions: [
    {
      extension: RrwExEpic,
      options: {
        staticEpic: appEpic,
      },
    },
  ],
  middlewares: [routerMiddleware(history), localStorageMiddleware, createReduxWaitForMiddleware()],
  compose: composeEnhancers,
});
