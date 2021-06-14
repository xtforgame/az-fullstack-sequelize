import React from 'react';
import axios from 'axios';
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
import BuyerDetail from './BuyerDetail';
import RecipientDetail from './RecipientDetail';

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
  flexContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  actions: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  }
}));

export default function DetailTable(props) {
  const {
    row,
    onRefresh = () => null,
  } = props;

  const orderInfo : OrderInfo = props.orderInfo;

  const assign = async (orderId, productId, mode = '') => {
    await axios({
      method: 'post',
      url: 'api/assign-order-product',
      data: {
        orderId,
        productId,
        mode,
      },
    });
    onRefresh();
  }

  const release = async (orderId, productId, mode = '') => {
    await axios({
      method: 'post',
      url: 'api/release-order-product',
      data: {
        orderId,
        productId,
        mode,
      },
    });
    onRefresh();
  }

  const classes = useStyles();

  if (!orderInfo) {
    return null;
  }

  return (
    <Paper className={classes.paper} elevation={0}>
      <div className={classes.flexContainer}>
        <Typography variant="h6" gutterBottom component="div">
          商品清單
        </Typography>
        <Button color="primary" variant="contained" onClick={() => assign(row.id, null, 'all')}>
          自動備貨
        </Button>
      </div>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>商品</TableCell>
            <TableCell>名稱</TableCell>
            <TableCell align="right">單價</TableCell>
            <TableCell align="right">數量</TableCell>
            <TableCell align="right">總價 ($)</TableCell>
            <TableCell>備註</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.products.map(opMn => (
            <TableRow key={opMn.id}>
              <TableCell>
                <Avatar variant="square" className={classes.square}>
                  {opMn.product.size}
                </Avatar>
              </TableCell>
              <TableCell component="th" scope="row">
                <a href={`#product/edit/${opMn.product.id}`}>{opMn.product.name}</a>
              </TableCell>
              <TableCell align="right">{opMn.quantity}</TableCell>
              <TableCell align="right">{opMn.price}</TableCell>
              <TableCell align="right">
                {opMn.subtotal}
              </TableCell>
              <TableCell>
                <div style={{ display: 'flex' }}>
                  <div>
                    <div>{opMn.product.soldout ? '[斷貨] ' : ''}備貨數量：{opMn.assignedQuantity}</div>
                    <div>尚餘數量：{opMn.product.instock}</div>
                  </div>
                  <div className={classes.actions}>
                    {opMn.assignedQuantity < opMn.quantity && (
                       <Button style={{ marginLeft: 20 }} variant="contained" onClick={() => assign(opMn.order_id, opMn.product_id)}>
                        備貨
                      </Button>
                    )}
                    {opMn.assignedQuantity > 0 && (
                      <Button style={{ marginLeft: 20 }} variant="contained" onClick={() => release(opMn.order_id, opMn.product_id)}>
                        取消備貨
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
          <TableRow style={{ backgroundColor: grey[300] }}>
            <TableCell> </TableCell>
            <TableCell component="th" scope="row">
              總價
            </TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right">
              {orderInfo.originalPrice}
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Avatar variant="rounded" className={classes.rounded}>
                <FlightLandIcon />
              </Avatar>
            </TableCell>
            <TableCell component="th" scope="row">
              運費
            </TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right">
              {orderInfo.shippingFee}
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
          <TableRow style={{ backgroundColor: yellow[300] }}>
            <TableCell> </TableCell>
            <TableCell component="th" scope="row">
              總金額
            </TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right"> </TableCell>
            <TableCell align="right">
              {row.metadata.total}
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}
