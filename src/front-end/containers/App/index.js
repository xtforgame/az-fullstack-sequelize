import React from 'react';

import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ConnectedRouter } from 'connected-react-router';
import useStylesByNs from 'azrmui/styles/useStylesByNs';
import ThemeContainer from '~/containers/core/ThemeContainer';
import {
  makeUiThemeSelector,
} from './selectors';


// This setup is only needed once per application;
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'v1/graphql',
    headers: {
      'x-hasura-admin-secret': 'xxxxhsr',
    },
  }),
});

const AppInternal = ({ history, routes }) => {
  useStylesByNs(['global']);
  return (
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  );
};

const App = props => (
  <ApolloProvider client={apolloClient}>
    <ThemeContainer uiTheme={props.uiTheme}>
      <AppInternal {...props} />
    </ThemeContainer>
  </ApolloProvider>
);

const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

export default compose(
  connect(mapStateToProps),
)(App);
