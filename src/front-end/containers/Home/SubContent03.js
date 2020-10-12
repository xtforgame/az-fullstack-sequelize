import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import TableAppBar from 'azrmui/core/Tables/TableAppBar';
import EnhancedTable from 'azrmui/core/Tables/EnhancedTable';
import SimpleTabs from './SimpleTabs';
import Chip from '@material-ui/core/Chip';
import createCommonStyles from 'azrmui/styles/common';

const styles = theme => ({
  ...createCommonStyles(theme, ['flex', 'appBar']),
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  paper: {
    width: '100%',
  },
  detailCell: {
    backgroundColor: theme.palette.background.default,
  },
});

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id, name, calories, fat, carbs, protein, expanded: false,
  };
}

const createList = () => [
  createData(0, '100233412', '外衣12', 'Basic', '2020/11/30', ''),
  createData(1, '100233411', '外衣11', 'Basic', '2020/11/30', '已下架'),
  createData(2, '100233410', '外衣10', 'Basic', '2020/11/30', ''),
  createData(3, '100233409', '外衣09', 'Basic', '2020/11/30', ''),
  createData(4, '100233408', '外衣08', 'Basic', '2020/11/30', ''),
  createData(5, '100233407', '外衣07', 'Basic', '2020/11/30', ''),
  createData(6, '100233406', '外衣06', 'Basic', '2020/11/30', '已下架'),
  createData(7, '100233405', '外衣05', 'Basic', '2020/11/30', ''),
  createData(8, '100233404', '外衣04', 'Basic', '2020/11/30', ''),
  createData(9, '100233403', '外衣03', 'Basic', '2020/11/30', ''),
  createData(10, '100233402', '外衣02', 'Basic', '2020/11/30', ''),
  createData(11, '100233401', '外衣01', 'Basic', '2020/11/30', ''),
];

const rows = createList();

class SubContent03 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getColumnData() {
    return [
      {
        id: 'name', numeric: false, padding: 'none', label: '商品編號',
      },
      { id: 'calories', numeric: false, label: '商品名稱' },
      // { id: 'fat', numeric: false, label: '商品名稱' },
      { id: 'carbs', numeric: false, label: ' 更新日' },
      { id: 'protein', numeric: false, label: '備註' },
    ];
  }

  render() {
    const {
      classes,
    } = this.props;
    return (
      <Paper className={classes.root}>
        <TableAppBar>
          <div className={classes.flex1} />
          <Chip
            label={`分類：外衣`}
            onDelete={() => {}}
            className={classes.appBarChip}
          />
          <IconButton color="inherit" onClick={() => {}} aria-label="refresh">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit" onClick={() => {}} aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        </TableAppBar>
        <EnhancedTable
          withDetail
          getActionMenuItems={closeMenu => ([
            <MenuItem
              key="edit"
              onClick={() => {
                // console.log('Edit');
                closeMenu();
              }}
            >
              Edit
            </MenuItem>,
            <MenuItem
              key="delete"
              onClick={() => {
                // console.log('Delete');
                closeMenu();
              }}
            >
              Delete
            </MenuItem>,
          ])}
          defaultSortBy="id"
          columns={this.getColumnData()}
          rows={rows}
          renderRowDetail={
            (row, { columns }) => (
              <Paper className={classes.paper}>
                <SimpleTabs row={row} columns={columns} />
              </Paper>
            )
          }
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(SubContent03);
