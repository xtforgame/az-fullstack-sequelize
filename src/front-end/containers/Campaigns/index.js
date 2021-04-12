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
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import { compose } from 'recompose';
import FileSaver from 'file-saver';
import { makeStyles } from '@material-ui/core/styles';
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
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';

import FilterSection from './FilterSection';
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

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: 900,
  },
}));

const getColumnConfig = () => {
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
};

const CAMPAIGN_LIST_QUERY = gql`
  query CampaignList {
    campaigns {
      id
      name
    }
  }
`;

export default (props) => {
  const [selected, setSelected] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const classes = useStyles();


  const { loading, error, data } = useQuery(CAMPAIGN_LIST_QUERY, { variables: { name: refreshCount.toString() }, fetchPolicy: 'network-only' });

  const refresh = async () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleAccept = async () => {
    const rows = createList();
    console.log('rows, selected :', rows, selected);
    await refresh();
  };

  const handleReject = async () => {

  };

  const handleDownload = async () => {
    const rows = createList();
    await Promise.all(
      selected.map(i => rows[i - 1])
      .map(async (row) => {
        FileSaver.saveAs('rma.xls', `${row.shipmentId}.xls`);
      })
    );
  };

  const renderActions = (numSelected) => {
    console.log(numSelected);
    return numSelected > 0 ? (
      <React.Fragment>
        <Tooltip title="核准">
          <IconButton aria-label="accept" onClick={() => handleAccept()}>
            <DoneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="駁回">
          <IconButton aria-label="reject" onClick={() => handleReject()}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="下載報告">
          <IconButton aria-label="download report" onClick={() => handleDownload()}>
            <SaveAltIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Tooltip title="新增活動">
          <IconButton color="primary" aria-label="新增活動">
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="重新整理">
          <IconButton aria-label="重新整理" onClick={refresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip> */}
      </React.Fragment>
    );
  };

  const rows = createList();

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in CAMPAIGN_LIST_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }
  if (data && data.campaigns) {
    console.log('data.campaigns :', data.campaigns);
  }

  return (
    <React.Fragment>
      <FilterSection />
      <EnhancedTable
        rows={rows}
        loading={loading}
        selected={selected}
        setSelected={setSelected}
        {...getColumnConfig()}
        toolbarProps={{
          title: '訂單管理',
          renderActions,
        }}
        paginationProps={{
          rowsPerPageOptions: [5, 10, 25, 50],
        }}
        renderRowDetail={row => (<DetailTable row={row} />)}
      />
    </React.Fragment>
  );
};
