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
  createData(0, '思序網路有限公司', 'rick.chen@vaxal.io', 'Basic', '2020/11/30', ''),
  createData(1, '炙星股份有限公司', 'starworks@gmail.com', 'Basic', '2021/01/21', ''),
  createData(2, '思序網路有限公司', 'rick.chen@vaxal.io', 'Basic', '2020/11/30', ''),
  createData(3, '炙星股份有限公司', 'starworks@gmail.com', 'Basic', '2021/01/21', ''),
  createData(4, '思序網路有限公司', 'rick.chen@vaxal.io', 'Basic', '2020/11/30', ''),
  createData(5, '炙星股份有限公司', 'starworks@gmail.com', 'Basic', '2021/01/21', ''),
  createData(6, '思序網路有限公司', 'rick.chen@vaxal.io', 'Basic', '2020/11/30', ''),
  createData(7, '炙星股份有限公司', 'starworks@gmail.com', 'Basic', '2021/01/21', ''),
  createData(8, '思序網路有限公司', 'rick.chen@vaxal.io', 'Basic', '2020/11/30', ''),
  createData(9, '炙星股份有限公司', 'starworks@gmail.com', 'Basic', '2021/01/21', ''),
  createData(10, '思序網路有限公司', 'rick.chen@vaxal.io', 'Basic', '2020/11/30', ''),
  createData(11, '炙星股份有限公司', 'starworks@gmail.com', 'Basic', '2021/01/21', ''),
];

const rows = createList();

class SubContent03 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getColumnData() {
    return [
      {
        id: 'name', numeric: false, padding: 'none', label: '客戶名稱',
      },
      { id: 'calories', numeric: false, label: '帳號' },
      { id: 'fat', numeric: false, label: '訂閱方案' },
      { id: 'carbs', numeric: false, label: '到期日' },
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
            label={`訂閱中客戶`}
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
