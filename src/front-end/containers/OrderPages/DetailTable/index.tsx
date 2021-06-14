import React, { useEffect, useState } from 'react';
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
import {
  Order, Campaign, Product, ShippingFee, calcOrderInfo,
  toShippingFeeTableMap,
  ShippingFeeTableMap, OrderInfo,
} from 'common/domain-logic/gql-helpers';
import OrderDetail from './OrderDetail';
import BuyerDetail from './BuyerDetail';
import RecipientDetail from './RecipientDetail';
import ProductDetail from './ProductDetail';

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
    onRefresh = () => null,
    shippingFeeTableMap,
  } = props;

  const classes = useStyles();
  const [orderInfo, setOrderInfo] = useState<OrderInfo | undefined>();

  useEffect(() => {
    if (row && shippingFeeTableMap) {
      setOrderInfo(calcOrderInfo(row, shippingFeeTableMap));
    } else {
      setOrderInfo(undefined);
    }
  }, [row, shippingFeeTableMap ]);

  return (
    <React.Fragment>
      <Box className={classes.box} margin={1}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <OrderDetail
              row={row}
            />
            <BuyerDetail
              row={row}
            />
            <RecipientDetail
              row={row}
            />
            {/* <Divider /> */}
          </div>
          <div>
            <ProductDetail
              orderInfo={orderInfo}
              row={row}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      </Box>
    </React.Fragment>
  );
}
