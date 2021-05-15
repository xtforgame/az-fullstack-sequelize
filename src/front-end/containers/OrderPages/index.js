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
import useGqlQuery from '~/hooks/useGqlQuery';
import FilterSection from './FilterSection';
import DetailTable from './DetailTable';

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: 900,
  },
}));

const renderRowCell = (columnName, row, option) => (
  <ContentText>
    {row[columnName] ? moment(row[columnName]).format('YYYY/MM/DD[\n]hh:mm:ss') : 'N/A'}
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
      label: '客戶名稱',
      sortable: false,
      align: 'left',
      size: 200,
      renderRowCell: (columnName, row, option) => (
        <ContentText>
          {row.user.name}
        </ContentText>
      ),
    },
    {
      id: 'buyer_email',
      label: 'Email',
      sortable: false,
      align: 'left',
      size: 200,
      compareFunc: (a, b, orderBy) => {
        if (b.data.orderData.order.buyer.email > a.data.orderData.order.buyer.email) {
          return -1;
        }
        if (b.data.orderData.order.buyer.email < a.data.orderData.order.buyer.email) {
          return 1;
        }
        return 0;
      },
      renderRowCell: (columnName, row, option) => (
        <ContentText>
          {row.data.orderData.order.buyer.email}
        </ContentText>
      ),
    },

    // {
    //   id: 'price',
    //   label: '價格（新台幣）',
    //   sortable: false,
    //   align: 'right',
    //   size: 200,
    // },
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
      sortable: false,
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
            <IconButton color="primary" aria-label="修改" onClick={() => push(`/product-group/edit/${row.id}`)}>
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
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const classes = useStyles();

  const query = useRouterQuery();
  // console.log('query.get("text") :', query.get('text'));
  const gqlQuery = useGqlQuery(
    'orders',
    'orderAggregate',
    `
      id
      user { id, name }
      memo
      orderer
      recipient
      data
      created_at
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
      // args: ['$name: String!'],
      // where: ['{name: {_ilike: $name}}'],
      orderBy: '{created_at: desc}',
    },
  );
  const { loading, error, data } = useQuery(gqlQuery, {
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

  useEffect(() => {
    if (data && data.orders) {
      setRows(data.orders);
    }
  }, [data]);

  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return (
      <pre>
        Error in ORDER_LIST_QUERY
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <React.Fragment>
      <FilterSection />
      <BasicSection>
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
            rowsPerPageOptions: [10, 25, 50, 75],
          }}
          renderRowDetail={row => (<DetailTable assign={async (orderId, productId) => {
            await axios({
              method: 'post',
              url: 'api/assign-order-product',
              data: {
                orderId,
                productId,
              },
            });
            refresh();
          }} row={row} products={row.products} />)}
        />
      </BasicSection>
    </React.Fragment>
  );
};
