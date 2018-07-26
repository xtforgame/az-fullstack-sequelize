// @flow weak

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableAppBar from './TableAppBar';
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

class TableSearchBar extends React.Component {
  render(){
    const {
      classes,
      searchingText,
      onRequestSearch = () => {},
      onRequestClearSearchText = () => {},
      onRequestRefresh = () => {},
    } = this.props;
    return (
      <TableAppBar>
        <div className={classes.flex1} />
        {searchingText && <Chip
          color="inherit"
          label={`Search for '${searchingText}'`}
          onDelete={onRequestClearSearchText}
          className={classes.appBarChip}
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
      </TableAppBar>
    );
  }
}


export default compose(
  withStyles(styles),
)(TableSearchBar);
