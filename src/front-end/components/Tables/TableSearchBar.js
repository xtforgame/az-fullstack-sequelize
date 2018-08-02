// @flow weak

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Chip from '@material-ui/core/Chip';
import { compose } from 'recompose';
import SearchInput from './SearchInput';
import createCommonStyles from '~/styles/common';

import TableAppBar from './TableAppBar';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
});

class TableSearchBar extends React.Component {
  render() {
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
        {searchingText && (
          <Chip
            color="inherit"
            label={`Search for '${searchingText}'`}
            onDelete={onRequestClearSearchText}
            className={classes.appBarChip}
          />
        )}
        {!searchingText && (
          <SearchInput
            placeholder="Search"
            onChange={() => {}}
            onRequestSearch={onRequestSearch}
            style={{
              margin: '0 auto',
              maxWidth: 800,
            }}
          />
        )}
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
