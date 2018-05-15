import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { MenuItem } from 'material-ui/Menu';
import EnhancedTable from '~/components/Tables/EnhancedTable';
import SimpleTabs from './SimpleTabs';

const styles = theme => ({
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

const rows = createList();

class SubContent03 extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  getColumnData(){
    const {
      classes,
    } = this.props;
    return [
      { id: 'name', numeric: false, padding: 'none', label: 'Dessert (100g serving)' },
      { id: 'calories', numeric: true, label: 'Calories' },
      { id: 'fat', numeric: true, label: 'Fat (g)' },
      { id: 'carbs', numeric: true, label: 'Carbs (g)' },
      { id: 'protein', numeric: true, label: 'Protein (g)' },
    ];
  }
  
  render() {
    const {
      classes,
    } = this.props;
    return (
      <Paper className={classes.root}>
        <EnhancedTable
          withDetail
          getActionMenuItems={(closeMenu) => ([
            <MenuItem
              key={'edit'} 
              onClick={() => {
                console.log('Edit');
                closeMenu();
              }}
            >
              Edit
            </MenuItem>,
            <MenuItem
              key={'delete'} 
              onClick={() => {
                console.log('Delete');
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
            (row, { columns }) => <Paper className={classes.paper}>
              <SimpleTabs row={row} columns={columns} />
            </Paper>
          }
        />
      </Paper>
    );
  }
}

SubContent03.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SubContent03);
