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
import ContentText from 'azrmui/core/Text/ContentText';
import {
  orderStates,
  orderStateNameFunc,
  orderPayWayNameFunc,
} from 'common/domain-logic/constants/order';
import { getDisplayTime } from '~/utils';

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
      <Typography variant="h6" gutterBottom component="div">
        購買人資訊
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>姓名</TableCell>
            <TableCell align="left">付款方式</TableCell>
            <TableCell align="right">付款時間</TableCell>
            <TableCell>備註</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              {row.buyer.name}
            </TableCell>
            <TableCell align="left">
              {orderPayWayNameFunc(row.payWay)}
            </TableCell>
            <TableCell align="right">
              <ContentText>
                {getDisplayTime(row.paidAt)}
              </ContentText>
            </TableCell>
            <TableCell>{row.recipient.memo}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
