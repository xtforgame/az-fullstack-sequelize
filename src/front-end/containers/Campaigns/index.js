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
import {
  campaignTypeInfo,
  campaignTypeNameMap,
  campaignTypeNameFunc,
  campaignTypes,
  campaignStateInfo,
  campaignStateNameMap,
  campaignStateNameFunc,
  campaignStates,
} from 'common/domain-logic/constants/campaign';
import BasicSection from '~/components/Section/Basic';
import ControlledEnhancedTable from '~/components/ControlledEnhancedTable';
import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import useGqlQuery from '~/hooks/useGqlQuery';
import useGqlTable from '~/containers/hooks/useGqlTable';

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
      label: 'ID',
      align: 'left',
      size: 120,
    },
    {
      id: 'name',
      label: '活動名稱',
      sortable: false,
      align: 'left',
      size: 200,
    },
    {
      id: 'type',
      label: '活動類型',
      sortable: false,
      align: 'left',
      size: 200,
      renderRowCell: (columnName, row) => campaignTypeNameFunc(row[columnName]),
    },
    // {
    //   id: 'durationType',
    //   label: '活動類型',
    //   sortable: false,
    //   align: 'left',
    //   size: 200,
    // },
    {
      id: 'state',
      label: '活動狀態',
      sortable: false,
      align: 'left',
      size: 200,
      renderRowCell: (columnName, row) => campaignStateNameFunc(row[columnName]),
    },
    {
      id: 'start',
      label: '開始時間',
      sortable: false,
      align: 'right',
      renderRowCell,
      size: 200,
    },
    {
      id: 'end',
      label: '結束時間',
      sortable: false,
      align: 'right',
      renderRowCell,
      size: 200,
    },
    // {
    //   id: 'data',
    //   label: '客戶名稱',
    //   sortable: false,
    //   align: 'left',
    //   size: 60,
    // },
    // {
    //   id: 'created_at',
    //   label: '建立時間',
    //   sortable: false,
    //   align: 'right',
    //   renderRowCell,
    //   size: 200,
    // },
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
            <IconButton color="primary" aria-label="修改" onClick={() => push(`/campaign/edit/${row.id}`)}>
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
      orderBy: 'id',
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

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);

  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState('dense');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const classes = useStyles();

  const gqlQuery = useGqlQuery(
    'campaigns',
    'campaignAggregate',
    'id name type durationType state start end data created_at updated_at deleted_at',
    {
      // args: ['$name: String!'],
      // where: ['{name: {_ilike: $name}}'],
      orderBy: `{${orderBy || 'id'}: ${order || 'desc'}}`,
      offset: page * rowsPerPage,
      limit: rowsPerPage,
    },
  );

  const handleAccept = async (refresh) => {
    await refresh();
  };

  const handleReject = async () => {

  };

  const handleDownload = async () => {
    await Promise.all(
      selected.map(i => rows[i - 1])
      .map(async (row) => {
        FileSaver.saveAs('rma.xls', `${row.shipmentId}.xls`);
      })
    );
  };

  const push = useRouterPush();
  const renderActions = (numSelected, { refresh }) => (numSelected > 0 ? (
    <React.Fragment>
      <Tooltip title="核准">
        <IconButton aria-label="accept" onClick={() => handleAccept(refresh)}>
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
        <IconButton color="primary" aria-label="新增活動" onClick={() => push('/campaign/edit/new')}>
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
  ));


  const { render } = useGqlTable({
    getQueryConfig: () => ({
      queryData: gqlQuery,
      getQueryOption: refreshCount => ({
        variables: {
          name: '%w%',
          refreshCount: refreshCount.toString(),
        },
        fetchPolicy: 'network-only',
      }),
      getRowsAndCount: data => ({
        list: data?.campaigns || [],
        count: data?.campaignAggregate?.aggregate?.count || 0,
      }),
    }),
    title: '活動管理',
    renderActions,
    getColumnConfig,
    rowsPerPageOptions: [10, 25, 50, 75],
    renderError: error => (
      <pre>
        Error
        {JSON.stringify(error, null, 2)}
      </pre>
    ),
    renderRowDetail: row => (<DetailTable row={row} />),

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
      <FilterSection />
      <BasicSection>
        {render()}
      </BasicSection>
    </React.Fragment>
  );
};
