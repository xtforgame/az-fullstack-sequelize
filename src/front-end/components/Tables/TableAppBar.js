// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Chip from '@material-ui/core/Chip';
import SearchInput from './SearchInput';

import { compose } from 'recompose';

const styles = theme => ({
  root: {
    // marginTop: theme.spacing.unit * 3,
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  chip: {
    color: theme.palette.common.white,
    margin: theme.spacing.unit,
    background: fade(theme.palette.common.white, 0.15),
    '&:hover, &:focus': {
      background: fade(theme.palette.common.white, 0.15),
    },
    '&:active': {
      background: fade(theme.palette.common.white, 0.15),
    },
  },
});

class TableAppBar extends React.Component {
  render(){
    const {
      classes,
      searchingText,
      onRequestSearch = () => {},
      onRequestClearSearchText = () => {},
      onRequestRefresh = () => {},
    } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.flex1} />
            {searchingText && <Chip
              color="inherit"
              label={`Search for '${searchingText}'`}
              onDelete={onRequestClearSearchText}
              className={classes.chip}
              style={{
                maxWidth: 800,
              }}
            />}
            {!searchingText && <SearchInput
              placeholder="Search"
              onChange={() => {}}
              onRequestSearch={onRequestSearch}
              style={{
                margin: '0 auto',
                maxWidth: 800,
              }}
            />}
            <IconButton color="inherit" onClick={onRequestRefresh} aria-label="refresh">
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


export default compose(
  withStyles(styles),
)(TableAppBar);
