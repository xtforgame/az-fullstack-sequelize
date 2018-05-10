import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { injectIntl } from 'react-intl';
import {
  changeTheme,
} from './actions';
import {
  withRouter,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import formatMessage from '~/utils/formatMessage';
import { messages } from './translation';
import { ConnectedRouter } from 'react-router-redux';
import { changeLocale } from '~/containers/LanguageProvider/actions';
import { makeSelectLocale } from '~/containers/LanguageProvider/selectors';

import { withStyles } from 'material-ui/styles';
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
  componentDidMount(){
    // setInterval(() => {
    //   if(this.props.uiTheme.paletteType === 'dark'){
    //     this.toLight();
    //   }else if(this.props.uiTheme.paletteType === 'light'){
    //     this.toVaxal();
    //   }else{
    //     this.toDark();
    //   }
    // }, 1000);
  }

  toDark(){
    this.props.changeTheme({
      direction: 'ltr',
      paletteType: 'dark',
    });
  }

  toLight(){
    this.props.changeTheme({
      direction: 'ltr',
      paletteType: 'light',
    });
  }

  toVaxal(){
    this.props.changeTheme({
      direction: 'ltr',
      paletteType: 'vaxal',
    });
  }

  render(){
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
  connect(mapStateToProps, {
    changeTheme,
  }),
)(App);

