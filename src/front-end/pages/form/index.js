/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import {
  runningMode,
} from 'config';

import { changeLocale } from '~/containers/LanguageProvider/actions';
import AppWrapper from '~/app-wrapper';
import configureStore from '~/configureStore';

import App from './App';
import {
  CLEAR_SENSITIVE_DATA,
} from './constants';
import appReducer from './reducer';
import appEpic from './epic';
import { urlPrefix } from './env';
import { loadState, middleware as localStorageMiddleware } from '../../localStorage';
import { i18nextInited, appLocaleMap } from './i18next';
import 'react-image-lightbox/style.css';
import './main.css';

// Create a history of your choosing (we're using a browser history in this case)
const history = null;

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

console.log('runningMode :', runningMode);

// This setup is only needed once per application;
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${urlPrefix}v1/graphql`,
    headers: {},
  }),
});

const renderDom = async () => {
  const i18n = await i18nextInited;
  const locale = appLocaleMap[i18n.language] || 'en';
  store.dispatch(changeLocale(locale));
  ReactDOM.render(
    <AppWrapper App={App} store={store} history={history} apolloClient={apolloClient} routes={null} />,
    document.getElementById('page_main')
  );
};


renderDom();
