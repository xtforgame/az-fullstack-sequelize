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
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import moment from 'moment';
import qs from 'qs';
/* eslint-disable react/sort-comp */
import axios from 'axios';
import { compose } from 'recompose';
import FileSaver from 'file-saver';
import { makeStyles } from '@material-ui/core/styles';
// import { getDefaultBeforeDaysConfig, makeDaysFilter } from '~/utils/beforeDaysHelper';
// import { compareString, formatTime } from '~/utils/tableUtils';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import ContentText from 'azrmui/core/Text/ContentText';
import BasicSection from '~/components/Section/Basic';
import EnhancedTable from '~/components/EnhancedTable';
import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import useGqlQuery from '~/hooks/useGqlQuery';
import useGqlTable from '~/containers/hooks/useGqlTable';
import {
  orderStates,
  orderStateNameFunc,
  orderPayWayNameFunc,
} from 'common/domain-logic/constants/order';

import FilterSection from './FilterSection';
import DetailTable from './DetailTable';

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: 900,
  },
}));

const renderRowCell = (columnName, row, option) => (
  <ContentText>
    {row[columnName] ? moment(row[columnName]).format('YYYY/MM/DD[\n]HH:mm:ss') : 'N/A'}
  </ContentText>
);

const getColumnConfig = () => {
  const columns = [
    {
      id: 'id',
      label: '訂單ID',
      align: 'left',
      size: 120,
    },
    {
      id: 'user',
      label: '購買人',
      sortable: false,
      align: 'left',
      size: 200,
      renderRowCell: (columnName, row, option) => (
        <ContentText>
          {row.buyer.name}
        </ContentText>
      ),
    },
    {
      id: 'state',
      label: '狀態',
      sortable: true,
      align: 'left',
      size: 200,
      rowCellToString: (columnName, row, option) => orderStateNameFunc(row[columnName]),
    },
    {
      id: 'buyer_email',
      label: 'Email',
      sortable: false,
      align: 'left',
      size: 200,
      compareFunc: (a, b, orderBy) => {
        if (b.buyer.email1 > a.buyer.email1) {
          return -1;
        }
        if (b.buyer.email1 < a.buyer.email1) {
          return 1;
        }
        return 0;
      },
      renderRowCell: (columnName, row, option) => (
        <ContentText>
          {row.buyer.email1}
        </ContentText>
      ),
    },
    // {
    //   id: 'weight',
    //   label: '重量',
    //   sortable: false,
    //   align: 'right',
    //   size: 200,
    // },
    // {
    //   id: 'productCount',
    //   label: '商品數量',
    //   sortable: false,
    //   align: 'right',
    //   size: 200,
    //   renderRowCell: (columnName, row, option) => (
    //     <ContentText>
    //       {row.products_aggregate.aggregate.count}
    //     </ContentText>
    //   ),
    // },
    // {
    //   id: 'data',
    //   label: '客戶名稱',
    //   sortable: false,
    //   align: 'left',
    //   size: 60,
    // },
    {
      id: 'created_at',
      label: '建立時間',
      sortable: true,
      align: 'right',
      renderRowCell,
      size: 200,
    },
    // {
    //   id: 'updated_at',
    //   label: '最後更新時間',
    //   sortable: false,
    //   align: 'right',
    //   renderRowCell,
    //   size: 200,
    // },
    {
      id: '__action__',
      label: '',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      renderRowCell: (columnName, row, option) => {
        const push = useRouterPush();
        return (
          <Tooltip title="修改">
            <IconButton color="primary" aria-label="修改" onClick={() => push(`/order/edit/${row.id}`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        );
      },
      size: 64,
    },
  ];

  const data = {
    columns,
    defaultSorting: {
      order: 'desc',
      orderBy: 'date',
    },
    // columnSizes: [120, 120, 180, 150, null],
  };
  return data;
};

export default (props) => {
  const {
    location,
  } = props;
  console.log('location :', location);

  const search = qs.parse(location.search, { ignoreQueryPrefix: true });
  console.log('search :', search);

  const [filter, setFilter] = useState({});

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState('dense');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const query = useRouterQuery();
  // console.log('query.get("text") :', query.get('text'));
  
  const args = [];
  const where = [];

  let searchText = '';
  let searchId = '';
  if (filter && filter.searchText && filter.searchText !== 'all') {
    searchText = `%${filter.searchText}%`;
    searchId = parseInt(filter.searchText) || 0;
    args.push('$searchText: String!');
    if (searchId) {
      args.push('$searchId: bigint!');
    }
    
    const orArray = [];
    orArray.push('{ user: { name: { _ilike: $searchText } } }');
    if (searchId) {
      orArray.push('{ id: { _eq: $searchId } }');
    }
    where.push(`{_or: [${orArray.join(',')}]}`);
  }

  let state = 'all';
  if (filter && filter.state && filter.state !== 'all') {
    state = filter.state;
    args.push('$state: String!');
    where.push('{ state: { _eq: $state } }');
  }
  let startTime = '1970-01-01T00:00:00.000+00:00';
  let endTime = '1970-01-01T00:00:00.000+00:00';

  if (filter && filter.dateRange && filter.dateRange[0]) {
    startTime = moment(filter.dateRange[0]).utc().toISOString();
    args.push('$startTime: timestamptz!');
    where.push('{ created_at: { _gte: $startTime } }');
  }

  if (filter && filter.dateRange && filter.dateRange[1]) {
    endTime = moment(filter.dateRange[1]).utc().toISOString();
    args.push('$endTime: timestamptz!');
    where.push('{ created_at: { _lte: $endTime } }');
  }

  console.log('startTime, endTime :', startTime, endTime);

  const gqlQuery = useGqlQuery(
    'orders',
    'orderAggregate',
    `
      id
      user { id, name }
      buyer
      recipient
      data
      metadata
      created_at

      state
      memo
      payWay
      selectedAt
      expiredAt
      paidAt
      shippedAt
      invoiceNumber
      invoiceStatus
      atmAccount
      esunData
      esunOrderId
      esunTradeInfo
      esunTradeState
      paypalData
      paypalToken
      cvsName
      smseData
      smsePayno
      smseSmilepayno

      products {
        price
        quantity
        subtotal
        assignedQuantity
        order_id
        id
        data
        product_id
        product {
          name
          customId
          id
          size
          instock
          orderQuota
          soldout
        }
      }
    `,
    {
      // args: ['$name: String!', '$state: String!'],
      // where: ['{ user: { name: { _ilike: $name } } }', `{ state: { _eq: $state } }`],
      args,
      where,
      orderBy: `{${orderBy || 'id'}: ${order || 'desc'}}`,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
      debug: true,
    },
  );

  const push = useRouterPush();
  const renderActions = (numSelected, { refresh }) => (numSelected > 0 ? (
    <React.Fragment>
      <Tooltip title="核准">
        <IconButton aria-label="accept" onClick={async () => {
          await refresh();
        }}>
          <DoneIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="駁回">
        <IconButton aria-label="reject" onClick={async () => {

        }}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="下載報告">
        <IconButton aria-label="download report" onClick={async () => {
          await Promise.all(
            selected.map(i => rows[i - 1])
            .map(async (row) => {
              FileSaver.saveAs('rma.xls', `${row.shipmentId}.xls`);
            })
          );
        }}>
          <SaveAltIcon />
        </IconButton>
      </Tooltip>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Button
        variant="outlined"
        color="secondary"
        onClick={async (e) => {
          await axios({
            method: 'post',
            url: 'api/assign-all',
          });
          refresh();
        }}
        style={{ flexShrink: 0 }}
      >
        自動備貨
      </Button>
      {/* <Tooltip title="新增商品群組">
        <IconButton color="primary" aria-label="新增商品群組" onClick={() => push('/product-group/edit/new')}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="重新整理">
        <IconButton aria-label="重新整理" onClick={refresh}>
          <RefreshIcon />
        </IconButton>
      </Tooltip> */}
      {/* <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip> */}
    </React.Fragment>
  ));

  const { render } = useGqlTable({
    getQueryConfig: () => ({
      queryData: gqlQuery,
      getQueryOption: refreshCount => ({
        variables: {
          name: '%w%',
          searchText,
          searchId,
          state,
          refreshCount: refreshCount.toString(),
          startTime,
          endTime,
        },
        fetchPolicy: 'network-only',
      }),
      getRowsAndCount: data => ({
        list: data?.orders || [],
        count: data?.orderAggregate?.aggregate?.count || 0,
      }),
    }),
    title: '訂單管理',
    renderActions,
    getColumnConfig,
    rowsPerPageOptions: [10, 25, 50, 75],
    renderError: error => (
      <pre>
        Error
        {JSON.stringify(error, null, 2)}
      </pre>
    ),
    renderRowDetail: (row, _, __, { refresh }) => (
      <DetailTable
        row={row}
        onRefresh={refresh}
      />
    ),

    rows,
    setRows,
    selected,
    setSelected,

    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    setPage,
    dense,
    setDense,
    rowsPerPage,
    setRowsPerPage,
  });

  return (
    <React.Fragment>
      <FilterSection defaultValue={filter} onChange={setFilter} />
      <BasicSection>
        {render()}
      </BasicSection>
    </React.Fragment>
  );
};
