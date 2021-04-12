/* eslint-disable react/sort-comp */
import React from 'react';
import axios from 'axios';
import { compose } from 'recompose';
import FileSaver from 'file-saver';
import { withStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';

import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

import EnhancedTable from '../../components/EnhancedTable';
import DetailTable from './DetailTable';

function createData(id, name, account, shipmentId, date, serialNumbers = []) {
  return {
    id,
    name,
    account,
    shipmentId,
    date,
    comment: serialNumbers && serialNumbers.length ? `商品：${serialNumbers.join(',')}` : '',
    expanded: false,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
    serialNumbers,
  };
}

const createList = () => [
  createData(1, 'CEBRDBDRB293847801', 'Rick Chen', 'KMXX7801', '2021/01/21', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(2, 'CEBRDBDRB293847802', 'TestUser', 'KMXX7802', '2020/11/30', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(3, 'CEBRDBDRB293847803', 'TestUser', 'KMXX7803', '2021/01/21', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(4, 'CEBRDBDRB293847804', 'TestUser', 'KMXX7804', '2020/11/30', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(5, 'CEBRDBDRB293847805', 'TestUser', 'KMXX7805', '2021/01/21', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(6, 'CEBRDBDRB293847806', 'TestUser', 'KMXX7806', '2020/11/30', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(7, 'CEBRDBDRB293847807', 'TestUser', 'KMXX7807', '2021/01/21', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(8, 'CEBRDBDRB293847808', 'TestUser', 'KMXX7808', '2020/11/30', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(9, 'CEBRDBDRB293847809', 'TestUser', 'KMXX7809', '2021/01/21', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(10, 'CEBRDBDRB293847810', 'TestUser', 'KMXX7810', '2020/11/30', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
  createData(11, 'CEBRDBDRB293847811', 'TestUser', 'KMXX7811', '2021/01/21', ['XHXS23445643', 'XHXS23445644', 'XHXS23445645']),
];

const styles = theme => ({
  root: {
    // maxWidth: 900,
  },
});


class CustomerServiceEdit extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shop: '',
      selected: [],
    };
  }

  getColumnConfig = () => {
    const columns = [{
      id: 'name',
      label: '訂單ID',
      align: 'left',
    }, {
      id: 'account',
      label: '客戶名稱',
      sortable: false,
      align: 'left',
    }, {
      id: 'shipmentId',
      label: '貨運追蹤碼',
      sortable: false,
      align: 'left',
    }, {
      id: 'date',
      label: '時間',
      sortable: false,
      align: 'right',
    }, {
      id: 'comment',
      label: '備註',
      sortable: false,
      align: 'left',
    }];

    const data = {
      columns,
      defaultSorting: {
        order: 'desc',
        orderBy: 'date',
      },
      columnSizes: [120, 120, 180, 150, null],
    };
    return data;
  }

  //   saveFile = rows => () => {
  //     const xlsx = toXlsx(rows.map(r => ({
  //       ...r,
  //       platform: r.platform.name,
  //     })), [
  //       'platform',
  //       'rating',
  //       'updatedAt',
  //     ]);
  //     exportFile(xlsx, 'rating-export');
  //   }

  handleAccept = async () => {
    const rows = createList();
    const { selected } = this.state;
    console.log('rows, selected :', rows, selected);
    await this.refresh();
  }

  handleReject = async () => {

  }

  handleDownload = async () => {
    const rows = createList();
    const { selected } = this.state;
    await Promise.all(
      selected.map(i => rows[i - 1])
      .map(async (row) => {
        FileSaver.saveAs('rma.xls', `${row.shipmentId}.xls`);
      })
    );
  }

  refresh = async () => {
  }

  componentDidMount() {
    this.refresh();
  }

  renderActions = (numSelected) => {
    console.log(numSelected);
    return numSelected > 0 ? (
      <React.Fragment>
        <Tooltip title="核准">
          <IconButton aria-label="accept" onClick={() => this.handleAccept()}>
            <DoneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="駁回">
          <IconButton aria-label="reject" onClick={() => this.handleReject()}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="下載報告">
          <IconButton aria-label="download report" onClick={() => this.handleDownload()}>
            <SaveAltIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    ) : (
      <Tooltip title="Filter list">
        <IconButton aria-label="filter list">
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    );
  }

  render() {
    const { classes } = this.props;
    console.log('check state stop', this.state.shop);
    const rows = createList();
    const { selected } = this.state;

    const setSelected = s => this.setState({ selected: s });

    return (
      <React.Fragment>
        <EnhancedTable
          rows={rows}
          selected={selected}
          setSelected={setSelected}
          {...this.getColumnConfig()}
          toolbarProps={{
            title: '訂單管理',
            renderActions: this.renderActions,
          }}
          paginationProps={{
            rowsPerPageOptions: [10, 25, 50, 75],
          }}
          renderRowDetail={row => (<DetailTable row={row} />)}
        />
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles)
)(CustomerServiceEdit);
