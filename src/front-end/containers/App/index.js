import React from 'react';
import { useConnect } from 'azrmui/hooks/redux-react-hook-ex';
import { createStructuredSelector } from 'reselect';
import { ConnectedRouter } from 'connected-react-router';
import useStylesByNs from 'azrmui/styles/useStylesByNs';
import ThemeContainer from '~/containers/core/ThemeContainer';
import {
  makeUiThemeSelector,
} from './selectors';


const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

const mapDispatchToProps = {};

const AppInternal = ({ history, routes }) => {
  useStylesByNs(['global']);
  return (
    <ConnectedRouter history={history}>
      {routes}
    </ConnectedRouter>
  );
};

export default (props) => {
  const {
    uiTheme,
  } = useConnect(mapStateToProps, mapDispatchToProps);

  return (
    <ThemeContainer uiTheme={uiTheme}>
      <AppInternal {...props} />
    </ThemeContainer>
  );
};
