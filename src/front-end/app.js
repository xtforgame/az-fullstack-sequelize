/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import {
  runningMode,
} from 'config';

import HeaderManager from 'azrmui/utils/HeaderManager';
import { changeLocale } from '~/containers/LanguageProvider/actions';
import AppWrapper from '~/app-wrapper';
import configureStore from '~/configureStore';
import getRoutes from './getRoutes';
import modelMapEx from './containers/App/modelMapEx';

import App from './containers/App';
import {
  CLEAR_SENSITIVE_DATA,
} from './containers/App/constants';
import appReducer from './containers/App/reducer';
import appEpic from './containers/App/epic';
import { loadState, middleware as localStorageMiddleware } from './localStorage';
import { i18nextInited, appLocaleMap } from './i18next';
import liffManager from './liff-manager';
import 'react-image-lightbox/style.css';
import 'grapesjs/dist/css/grapes.min.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import './containers/Home/GrapesJs/grapesjs/plugins/webPresetPlugin/dist/grapesjs-preset-webpage.min.css';
import './main.css';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHashHistory();

const initialState = {
  ...loadState(),
};
// console.log('initialState :', initialState);
const store = configureStore(initialState, history, {
  CLEAR_SENSITIVE_DATA,
  appReducer,
  appEpic,
  localStorageMiddleware,
});
const userSessionSelector = modelMapEx.cacher.selectorCreatorSet.session.selectMe();
const session = userSessionSelector(store.getState());

if (session) {
  // store.dispatch(sessionVerified(session));
  HeaderManager.set('Authorization', `${session.token_type} ${session.token}`);
  store.dispatch(modelMapEx.querchy.actionCreatorSets.session.read('me'));
}

console.log('runningMode :', runningMode);

// This setup is only needed once per application;
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'v1/graphql',
    headers: {},
  }),
});

const renderDom = async () => {
  const i18n = await i18nextInited;
  const locale = appLocaleMap[i18n.language] || 'en';
  store.dispatch(changeLocale(locale));
  await liffManager.login();
  ReactDOM.render(
    <AppWrapper App={App} store={store} history={history} apolloClient={apolloClient} routes={getRoutes()} />,
    document.getElementById('page_main')
  );
};


renderDom();
