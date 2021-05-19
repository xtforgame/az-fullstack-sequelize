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
import BasicSection from '~/components/Section/Basic';
import EnhancedTable from '~/components/EnhancedTable';
import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import FilterSection from './FilterSection';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  box: {
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
      label: '商品名稱',
      sortable: false,
      align: 'left',
      size: 200,
    },
    {
      id: 'price',
      label: '價格（新台幣）',
      sortable: false,
      align: 'right',
      size: 200,
    },
    {
      id: 'weight',
      label: '重量',
      sortable: false,
      align: 'right',
      size: 200,
    },
    {
      id: 'productCount',
      label: '商品數量',
      sortable: false,
      align: 'right',
      size: 200,
      renderRowCell: (columnName, row, option) => (
        <ContentText>
          {row.products_aggregate.aggregate.count}
        </ContentText>
      ),
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
            <IconButton color="primary" aria-label="修改" onClick={() => push(`/product/edit/${row.id}`)}>
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

const PRODUCT_LIST_QUERY = gql`
  query ProductGroupList {
    productGroups(where: {deleted_at: {_is_null: true}}, order_by: {created_at: desc}) {
      id
      uid
      customId
      products_aggregate(where: {deleted_at: {_is_null: true}}) {
        aggregate{ count }
      }
      products(where: {deleted_at: {_is_null: true}}) { id, name }
      category { id, name }
      campaigns(where: {deleted_at: {_is_null: true}}) { campaign {
        id
        name
        type
        durationType
        state
        start
        end
        data
        created_at
        updated_at
        deleted_at
      } }
      thumbnail
      pictures
      name
      price
      weight
      description
      materials
      data
    }
    productGroupAggregate(where: {deleted_at: {_is_null: true}}) {
      aggregate {
        count
      }
    }
  }
`;


const PRODUCT_LIST_SEARCH_QUERY = gql`
  query ProductGroupListSearch($name: String!) {
    productGroups(where: {deleted_at: {_is_null: true}, name: { _ilike: $name }}, order_by: {created_at: desc}) {
      id
      uid
      customId
      products_aggregate(where: {deleted_at: {_is_null: true}}) {
        aggregate{ count }
      }
      products(where: {deleted_at: {_is_null: true}}) { id, name }
      category { id, name }
      campaigns(where: {deleted_at: {_is_null: true}}) { campaign {
        id
        name
        type
        durationType
        state
        start
        end
        data
        created_at
        updated_at
        deleted_at
      } }
      thumbnail
      pictures
      name
      price
      weight
      description
      materials
      data
    }
    productGroupAggregate(where: {deleted_at: {_is_null: true}, name: { _ilike: $name }}) {
      aggregate {
        count
      }
    }
  }
`;

export default (props) => {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const classes = useStyles();

  const query = useRouterQuery();
  // console.log('query.get("text") :', query.get('text'));

  const { loading, error, data } = useQuery(PRODUCT_LIST_QUERY, {
    variables: {
      name: refreshCount.toString(),
    },
    fetchPolicy: 'network-only',
  });

  const refresh = async () => {
    setRefreshCount(refreshCount + 1);
  };

  const handleAccept = async () => {
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
  const renderActions = numSelected => (numSelected > 0 ? (
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
      <Tooltip title="新增商品">
        <IconButton color="primary" aria-label="新增商品" onClick={() => push('/product/edit/new')}>
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

  useEffect(() => {
    if (data && data.productGroups) {
      setRows(data.productGroups);
    }
  }, [data]);

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in PRODUCT_LIST_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <React.Fragment>
      {/* <Box className={classes.box} margin={1}>
        <EnhancedTable
          rows={rows}
          loading={loading}
          selected={selected}
          setSelected={setSelected}
          {...getColumnConfig()}
          toolbarProps={{
            title: '商品管理',
            renderActions,
          }}
          paginationProps={{
            rowsPerPageOptions: [10, 25, 50, 75],
          }}
          renderRowDetail={row => (<div />)}
        />
      </Box> */}
    </React.Fragment>
  );
};
