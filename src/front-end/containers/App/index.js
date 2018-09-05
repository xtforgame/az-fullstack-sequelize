import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ConnectedRouter } from 'react-router-redux';
import { withStyles } from '@material-ui/core/styles';

import withRoot from '../../components/withRoot';

import {
  makeUiThemeSelector,
} from './selectors';

// Apply some reset
const styles = theme => ({
  '@global': {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: 'antialiased', // Antialiasing.
      MozOsxFontSmoothing: 'grayscale', // Antialiasing.
    },
    body: {
      margin: 0,
    },
  },
});

const AppInternal = ({ history, routes }) => (
  <ConnectedRouter history={history}>
    {routes}
  </ConnectedRouter>
);

const AppWithTheme = compose(
  withRoot,
  withStyles(styles),
)(AppInternal);

class App extends React.Component {
  render() {
    return (
      <AppWithTheme
        {...this.props}
        uiTheme={this.props.uiTheme}
      />
    );
  }
}

const mapStateToProps = createStructuredSelector({
  uiTheme: makeUiThemeSelector(),
});

export default compose(
  connect(mapStateToProps),
)(App);
