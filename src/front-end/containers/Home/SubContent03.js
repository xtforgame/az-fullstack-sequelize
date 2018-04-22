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

function createData(id, name, calories, fat, carbs, protein) {
  return { id, name, calories, fat, carbs, protein, expanded: false };
}

const createList = () => [
  createData(0, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(1, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(2, 'Eclair', 262, 16.0, 24, 6.0),
  createData(3, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(4, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(5, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(6, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(7, 'Eclair', 262, 16.0, 24, 6.0),
  createData(8, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(9, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(10, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
];

class SimpleTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(...args){
    super(...args);
    this.state = {
      list: createList(),
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  toggleDetail(index) {
    this.state.list.filter(d => d.id !== index).map(d => d.expanded = false);
    this.state.list.splice(index, 1, {
      ...this.state.list[index],
      expanded: !this.state.list[index].expanded,
    });
    this.setState({
      list: [...this.state.list],
    });
  }

  render() {
    const { classes } = this.props;
    const { data, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.list.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell numeric>Calories</TableCell>
              <TableCell numeric>Fat (g)</TableCell>
              <TableCell numeric>Carbs (g)</TableCell>
              <TableCell numeric>Protein (g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n) => {
              return (
                <React.Fragment key={n.id}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <IconButton
                        onClick={() => { this.toggleDetail(n.id); }}>
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
