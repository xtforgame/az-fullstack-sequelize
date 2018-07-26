// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Chip from '@material-ui/core/Chip';
import SearchInput from './SearchInput';
import createCommonStyles from '~/styles/common';

import { compose } from 'recompose';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class TableAppBar extends React.Component {
  render(){
    const {
      classes,
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
