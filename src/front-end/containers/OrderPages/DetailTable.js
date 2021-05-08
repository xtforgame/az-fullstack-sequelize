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

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
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
  console.log('row :', row.products);

  return (
    <React.Fragment>
      <Box className={classes.box} margin={1}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom component="div">
                購買人資訊
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>姓名</TableCell>
                    <TableCell align="right">地址</TableCell>
                    <TableCell align="right">電話</TableCell>
                    <TableCell>備註</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.account}
                    </TableCell>
                    <TableCell align="right"> </TableCell>
                    <TableCell align="right">
                      {Math.round(15 * 12 * 100 * 5) / 100}
                    </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            {/* <Divider /> */}
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom component="div">
                收件人資訊
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>姓名</TableCell>
                    <TableCell align="right">地址</TableCell>
                    <TableCell align="right">電話</TableCell>
                    <TableCell>取貨方式</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {row.account}
                    </TableCell>
                    <TableCell align="right"> </TableCell>
                    <TableCell align="right">
                      {Math.round(15 * 12 * 100 * 5) / 100}
                    </TableCell>
                    <TableCell>台灣本島</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
            {/* <Divider /> */}
          </div>
          <div>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom component="div">
                商品清單
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>商品</TableCell>
                    <TableCell>名稱</TableCell>
                    <TableCell align="right">數量</TableCell>
                    <TableCell align="right">總價 ($)</TableCell>
                    <TableCell>備註</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map(opMn => console.log('opMn :', opMn) || (
                    <TableRow key={opMn.id}>
                      <TableCell>
                        <Avatar variant="square" className={classes.square}>
                          {opMn.product.size}
                        </Avatar>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {opMn.product.name}
                      </TableCell>
                      <TableCell align="right">{opMn.quantity}</TableCell>
                      <TableCell align="right">
                        {opMn.subtotal}
                      </TableCell>
                      <TableCell>
                        {opMn.product.soldout ? '[斷貨] ' : ''}備貨數量：{opMn.assignedQuantity}
                        <Button variant="contained" onClick={() => assign(opMn.order_id, opMn.product_id)}>
                          備貨
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow style={{ backgroundColor: grey[300] }}>
                    <TableCell> </TableCell>
                    <TableCell component="th" scope="row">
                      總價
                    </TableCell>
                    <TableCell align="right"> </TableCell>
                    <TableCell align="right">
                      {row.data.orderData.order.subtotal}
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
                    <TableCell align="right">
                      {row.data.orderData.order.shippingFee}
                    </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: yellow[300] }}>
                    <TableCell> </TableCell>
                    <TableCell component="th" scope="row">
                      總金額
                    </TableCell>
                    <TableCell align="right"> </TableCell>
                    <TableCell align="right">
                      {row.data.orderData.order.subtotal + row.data.orderData.order.shippingFee}
                    </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </div>
        </div>
      </Box>
    </React.Fragment>
  );
}
