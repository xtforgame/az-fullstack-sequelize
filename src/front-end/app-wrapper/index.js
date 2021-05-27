/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { StoreContext } from 'redux-react-hook';
import { SnackbarProvider } from 'notistack';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { ApolloProvider } from '@apollo/client/react';
import fontLoader from '../fontLoader';

export default (props) => {
  const {
    App, store, history, routes, apolloClient,
  } = props;
  const [app, setApp] = useState(() => (
    <div id="loading-page" style={{ fontFamily: '' }}>
      Loading Page
    </div>
  ));

  useEffect(() => {
    fontLoader().min
    .then(() => {
      setApp(<App history={history} routes={routes} />);
    });
  }, []);

  return (
    <Provider store={store}>
      <StoreContext.Provider value={store}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ApolloProvider client={apolloClient}>
              {app}
            </ApolloProvider>
          </MuiPickersUtilsProvider>
        </SnackbarProvider>
      </StoreContext.Provider>
    </Provider>
  );
};
