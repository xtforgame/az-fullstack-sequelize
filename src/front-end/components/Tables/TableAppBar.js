// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { compose } from 'recompose';
import createCommonStyles from '~/styles/common';


const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class TableAppBar extends React.Component {
  render() {
    const {
      children,
    } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          {children}
        </Toolbar>
      </AppBar>
    );
  }
}


export default compose(
  withStyles(styles),
)(TableAppBar);
