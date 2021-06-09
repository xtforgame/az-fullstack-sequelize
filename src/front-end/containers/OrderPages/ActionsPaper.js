import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Divider from '@material-ui/core/Divider';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { deepOrange, green, yellow, red, grey } from '@material-ui/core/colors';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import { FormSpace } from 'azrmui/core/FormInputs';

const useStyles = makeStyles(theme => ({
  square: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  rounded: {
    color: '#fff',
    backgroundColor: green[500],
  },
  box: {
  },
  paper: {
    width: '100%',
    border: `solid 1px ${theme.palette.grey[300]}`,
    marginBottom: 24,
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function DetailTable(props) {
  const {
    row,
    isItemSelected,
    assign,
  } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper} elevation={0}>
      <Button variant="contained" color="secondary">
        自動備貨
      </Button>
      <Button variant="contained" color="primary">
        出貨
      </Button>
    </Paper>
  );
}
