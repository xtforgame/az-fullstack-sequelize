/* eslint-disable global-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';

import configureStore from './configureStore';
import getRoutes from './getRoutes';
import fontLoader from './fontLoader';
import { loadState } from './localStorage';
import {
  makeUserSessionSelector,
} from '~/containers/App/selectors';

import { getTranslationMessages } from './i18n';
import App from '~/containers/App';
import {
  sessionVerified,
} from '~/containers/App/actions';
import './main.css';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

const initialState = {
  ...loadState(),
};
// console.log('initialState :', initialState);
const store = configureStore(initialState, history);
const userSessionSelector = makeUserSessionSelector();
const session = userSessionSelector(store.getState());

if (session) {
  store.dispatch(sessionVerified(session));
}

class AppWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      app: (
        <div id="loading-page" style={{ fontFamily: '' }}>
          Loading Page
        </div>
      ), // the loading page
    };
  }

  componentDidMount() {
    fontLoader().min
    .then(() => {
      this.setState({
        app: <App history={history} routes={getRoutes()} messages={this.props.messages} />,
      });
    });
  }

  render() {
    const { app } = this.state;
    return (
      <Provider store={store}>
        {app}
      </Provider>
    );
  }
}

const render = (messages) => {
  ReactDOM.render(
    <AppWrapper messages={messages} />,
    document.getElementById('page_main')
  );
};

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  require('intl');
  require('intl/locale-data/jsonp/en.js');
  require('intl/locale-data/jsonp/de.js');
  require('intl/locale-data/jsonp/zh.js');
  render(getTranslationMessages());
} else {
  render(getTranslationMessages());
}
