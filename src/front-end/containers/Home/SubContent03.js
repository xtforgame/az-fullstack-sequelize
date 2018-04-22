import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow, TablePagination } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import EnhancedTableHead from './EnhancedTableHead';
import SimpleTabs from './SimpleTabs';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
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

const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
  { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
  { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
  { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

function createData(id, name, calories, fat, carbs, protein) {
  return { id, name, calories, fat, carbs, protein, expanded: false };
}

const createList = () => [
  createData(0, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(1, 'Donut', 452, 25.0, 51, 4.9),
  createData(2, 'Eclair', 262, 16.0, 24, 6.0),
  createData(3, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(4, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(5, 'Honeycomb', 408, 3.2, 87, 6.5),
  createData(6, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(7, 'Jelly Bean', 375, 0.0, 94, 0.0),
  createData(8, 'KitKat', 518, 26.0, 65, 7.0),
  createData(9, 'Lollipop', 392, 0.2, 98, 0.0),
  createData(10, 'Marshmallow', 318, 0, 81, 2.0),
  createData(11, 'Nougat', 360, 19.0, 9, 37.0),
  createData(12, 'Oreo', 437, 18.0, 63, 4.0),
];

const defaultSortBy = 'id';

class SimpleTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args){
    super(...args);
    this.state = {
      list: createList()
        .sort((a, b) => (a[defaultSortBy] < b[defaultSortBy] ? -1 : 1)),
      page: 0,
      rowsPerPage: 5,
      order: 'asc',
      orderBy: defaultSortBy,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleRequestSort = (_, property) => {
    let orderBy = property || defaultSortBy;
    let order = 'desc';

    if (this.state.orderBy === property) {
      if(this.state.order === 'desc'){
        order = 'asc';
      }else{
        orderBy = defaultSortBy;
      }
    }

    const list = order === 'desc'
      ? this.state.list.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
      : this.state.list.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ list, order, orderBy });
  };

  toggleDetail(data) {
    const list = this.state.list.map(d => {
      let expanded = false;
      if(d.id === data.id){
        expanded = !d.expanded;
      }
      return {
        ...d,
        expanded,
      };
    });
    this.setState({
      list,
    });
  }

  render() {
    const { classes } = this.props;
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.list.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <EnhancedTableHead
            columnData={columnData}
            order={order}
            orderBy={orderBy}
            onRequestSort={this.handleRequestSort}
          />
          <TableBody>
            {this.state.list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n) => {
              return (
                <React.Fragment key={n.id}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <IconButton
                        onClick={() => { this.toggleDetail(n); }}>
                        {n.expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{n.name}</TableCell>
                    <TableCell numeric>{n.calories}</TableCell>
                    <TableCell numeric>{n.fat}</TableCell>
                    <TableCell numeric>{n.carbs}</TableCell>
                    <TableCell numeric>{n.protein}</TableCell>
                  </TableRow>
                  {n.expanded && <TableRow>
                    <TableCell colSpan="6" className={classes.detailCell}>
                      <Paper className={classes.paper}>
                        <SimpleTabs />
                      </Paper>
                    </TableCell>
                  </TableRow>}
                </React.Fragment>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 49 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={this.state.list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
