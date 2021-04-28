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
    row, isItemSelected,
  } = props;

  const classes = useStyles();

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
                  {['XHXS23445643', 'XHXS23445644', 'XHXS23445645'].map(snRow => (
                    <TableRow key={snRow}>
                      <TableCell>
                        <Avatar variant="square" className={classes.square}>
                          N
                        </Avatar>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {snRow}
                      </TableCell>
                      <TableCell align="right">{15}</TableCell>
                      <TableCell align="right">
                        {Math.round(15 * 12 * 100) / 100}
                      </TableCell>
                      <TableCell> [斷貨] 備貨數量：0 </TableCell>
                    </TableRow>
                  ))}
                  <TableRow style={{ backgroundColor: grey[300] }}>
                    <TableCell> </TableCell>
                    <TableCell component="th" scope="row">
                      總價
                    </TableCell>
                    <TableCell align="right"> </TableCell>
                    <TableCell align="right">
                      {Math.round(15 * 12 * 100 * 5) / 100}
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
                      (免運)
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
                      {Math.round(15 * 12 * 100 * 5) / 100}
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
