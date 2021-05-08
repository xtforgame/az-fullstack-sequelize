import React, { useState } from 'react';
import moment from 'moment';
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
import CalendarInput from '~/components/CalendarInput';

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
  const [leaves, setLeaves] = useState(() => {
    const startDate = moment().startOf('month');
    const endDateMs = moment(startDate).add(1, 'month').valueOf();

    const result = [];
    let date = startDate;
    while (date.valueOf() < endDateMs) {
      const baseName = date.format('YYYYMMDD');
      result.push({
        id: `${baseName}早班`,
        title: '可選',
        hideTime: true,
        start: moment(date).add(9, 'hours').toDate(),
        end: moment(date).add(22, 'hours').toDate(),
        desc: '營業時間',
        // selected: true,
      });
      date = moment(date).add(1, 'day');
    }
    return result;
  });

  return (
    <React.Fragment>
      <Box className={classes.box} margin={1}>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom component="div">
                員工資訊
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
                      {12}
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
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom component="div">
                期望休假時間
              </Typography>
              <CalendarInput value={leaves} onChange={setLeaves} />
            </Paper>
          </div>
          <div>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h6" gutterBottom component="div">
                本月成本
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>項目</TableCell>
                    <TableCell align="right">薪水 ($)</TableCell>
                    <TableCell align="right">公司負擔 ($)</TableCell>
                    <TableCell>備註</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      本薪
                    </TableCell>
                    <TableCell align="right">40,000</TableCell>
                    <TableCell align="right" />
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      加班/少班
                    </TableCell>
                    <TableCell align="right">3,000</TableCell>
                    <TableCell align="right" />
                    <TableCell>8hr</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      勞保
                    </TableCell>
                    <TableCell align="right">-3,000</TableCell>
                    <TableCell align="right">-1,000</TableCell>
                    <TableCell>級距：38,200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      勞退
                    </TableCell>
                    <TableCell align="right" />
                    <TableCell align="right">-1,000</TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      健保
                    </TableCell>
                    <TableCell align="right">-3,000</TableCell>
                    <TableCell align="right">-1,000</TableCell>
                    <TableCell>級距：38,200</TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: yellow[300] }}>
                    <TableCell component="th" scope="row">
                      總金額
                    </TableCell>
                    <TableCell align="right">37,000</TableCell>
                    <TableCell align="right">-3,000</TableCell>
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
