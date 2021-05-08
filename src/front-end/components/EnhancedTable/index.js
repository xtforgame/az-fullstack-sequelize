import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Fade from '@material-ui/core/Fade';
import ProgressWithMask from 'azrmui/core/Progress/ProgressWithMask';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedRow from './EnhancedRow';
import LoadingMask from './LoadingMask';
import useHalfControllable from '../../hooks/useHalfControllable';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function ascend(a, b, orderBy) {
  if (b[orderBy] > a[orderBy]) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(columns, order, orderBy) {
  const column = columns.find(c => c.id === orderBy)
  let compareFunc = ascend; // descendingComparator;
  if (column && column.compareFunc) {
    ({ compareFunc } = column);
  }
  return order === 'desc'
    ? (a, b) => -compareFunc(a, b, orderBy)
    : (a, b) => compareFunc(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    position: 'relative',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
    tableLayout: 'fixed',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable({
  rows,
  selected,
  setSelected,
  loading,

  toolbarProps,
  paginationProps,

  defaultSorting = {
    order: 'desc',
    orderBy: '',
  },

  order: orderProp,
  onOrderChange,

  orderBy: orderByProp,
  onOrderByChange,

  page: pageProp,
  onPageChange,

  dense: denseProp,
  onDenseChange,

  rowsPerPage: rowsPerPageProp,
  onRowsPerPageChange,

  columns: columnsProp,
  columnSizes: columnSizesProp,
  renderRowDetail,
}) {
  const classes = useStyles();
  const [order, setOrder] = useHalfControllable(orderProp || defaultSorting.order, onOrderChange, defaultSorting.order || 'id');
  const [orderBy, setOrderBy] = useHalfControllable(orderByProp || defaultSorting.orderBy, onOrderByChange, defaultSorting.orderBy || 'desc');
  const [page, setPage] = useHalfControllable(pageProp || 0, onPageChange, 0);
  const [dense, setDense] = useHalfControllable(denseProp != null ? denseProp : true, onDenseChange, true);
  const [rowsPerPage, setRowsPerPage] = useHalfControllable(rowsPerPageProp || 10, onRowsPerPageChange, 10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = id => selected.indexOf(id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          {...toolbarProps}
          numSelected={selected.length}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              columns={columnsProp}
              columnSizes={columnSizesProp}
            />
            <TableBody>
              {stableSort(rows, getComparator(columnsProp, order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <EnhancedRow
                      key={row.id}
                      index={index}
                      columns={columnsProp}
                      columnSizes={columnSizesProp}
                      renderRowDetail={renderRowDetail}
                      {...({
                        handleClick, row, isItemSelected, labelId,
                      })}
                    />
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          {...paginationProps}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <LoadingMask loading={loading} />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}
