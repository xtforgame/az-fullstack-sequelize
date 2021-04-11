/* This is an example snippet - you should consider tailoring it
to your service.
*/
/*
  Add these to your `package.json`:
    "apollo-boost": "^0.3.1",
    "graphql": "^14.2.1",
    "graphql-tag": "^2.10.0",
    "react-apollo": "^2.5.5"
*/
import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

/* eslint-disable react/sort-comp */
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

import FilterSection from './FilterSection';
import EnhancedTable from '../../components/EnhancedTable';
import DetailTable from './DetailTable';


function createData(id, name, inviter, account, shipmentId, date, serialNumbers = '') {
  return {
    id,
    name,
    inviter,
    account,
    shipmentId,
    date,
    comment: serialNumbers || '',
    expanded: false,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
    serialNumbers,
  };
}

const createList = () => [
  createData(1, 'CEBRDBDRB293847801', 'Rick Chen', '歐巴馬', '填寫中', '2021/01/21', '重要來賓'),
  createData(2, 'CEBRDBDRB293847802', 'Rick Chen', '川普', '已邀請', '2020/11/30', ''),
  createData(3, 'CEBRDBDRB293847803', 'Rick Chen', '拜登', '申請通過，請通知受邀人', '2021/01/21', ''),
  createData(4, 'CEBRDBDRB293847804', 'Rick Chen', '習近平', '名額已滿，請通知受邀人', '2020/11/30', ''),
  createData(5, 'CEBRDBDRB293847805', 'Rick Chen', '蔡英文', '已報到', '2021/01/21', '臨時邀請來賓'),
  createData(6, 'CEBRDBDRB293847806', 'Rick Chen', '韓總機', '未報到', '2020/11/30', '重要來賓'),
];

const styles = theme => ({
  root: {
    // maxWidth: 900,
  },
});


class OrderListBase extends React.PureComponent {
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
      label: '邀請碼ID',
      align: 'left',
    }, {
      id: 'inviter',
      label: '邀請人',
      sortable: false,
      align: 'left',
    }, {
      id: 'account',
      label: '邀請對象',
      sortable: false,
      align: 'left',
    }, {
      id: 'shipmentId',
      label: '狀態',
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
      columnSizes: [120, 120, 120, 240, 150, null],
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
        <FilterSection />
        <EnhancedTable
          rows={rows}
          selected={selected}
          setSelected={setSelected}
          {...this.getColumnConfig()}
          toolbarProps={{
            title: '邀請碼管理',
            renderActions: this.renderActions,
          }}
          paginationProps={{
            rowsPerPageOptions: [5, 10, 25, 50],
          }}
          renderRowDetail={row => (<DetailTable row={row} />)}
        />
      </React.Fragment>
    );
  }
}

const OrderList = compose(
  withStyles(styles)
)(OrderListBase);


const MY_QUERY_QUERY = gql`
  query MyQuery {
    orders(order_by: {created_at: desc}) {
      id
      memo
    }
  }
`;
const MyQueryQuery = props => (
  <Query
    query={MY_QUERY_QUERY}
  >
    {({ loading, error, data }) => {
      if (loading) return <pre>Loading</pre>;
      if (error) {
        return (
          <pre>
            Error in MY_QUERY_QUERY
            {JSON.stringify(error, null, 2)}
          </pre>
        );
      }

      if (data) {
        return <OrderList rows={data.orders} />;
      }
    }}
  </Query>
);

export default () => <MyQueryQuery />;
