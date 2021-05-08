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
import { toCurrency } from 'common/utils';
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
    // {
    //   id: 'id',
    //   label: 'ID',
    //   align: 'left',
    //   size: 120,
    // },
    {
      id: 'uid',
      label: '編號',
      align: 'left',
      padding: 'checkbox',
      size: 120,
    },
    {
      id: 'customId',
      label: '貨號',
      align: 'left',
      padding: 'checkbox',
      size: 120,
    },
    {
      id: 'name',
      label: '商品名稱',
      sortable: false,
      align: 'left',
      padding: 'checkbox',
      size: 200,
    },
    {
      id: 'color',
      label: '顏色',
      sortable: false,
      align: 'left',
      renderRowCell: (columnName, row, option) => {
        const color = JSON.parse(row[columnName]);
        console.log('color :', color);
        return (
          <div style={{ display: 'flex', }}>
            <div style={{ marginRight: 12, width: 24, height: 24, border: '1px solid black', backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}>
            </div>
            {row.colorName}
          </div>
        );
      },
      padding: 'checkbox',
      size: 100,
    },
    {
      id: 'size',
      label: '尺寸',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
    },
    {
      id: 'weight',
      label: '重量',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 120,
    },
    {
      id: 'price',
      label: '價格',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 120,
      renderRowCell: (columnName, row, option) => {
        return toCurrency(row[columnName]);
      },
    },
    {
      id: 'disabled',
      label: '狀態',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
      renderRowCell: (columnName, row, option) => {
        return row[columnName] ? '下架' : '';
      },
    },
    {
      id: 'isLimit',
      label: '限量',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
      renderRowCell: (columnName, row, option) => {
        return row[columnName] ? '是' : '';
      },
    },
    {
      id: 'soldout',
      label: '斷貨',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
      renderRowCell: (columnName, row, option) => {
        return row[columnName] ? '是' : '';
      },
    },
    {
      id: 'instock',
      label: '庫存',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
      renderRowCell: (columnName, row, option) => {
        return row[columnName];
      },
    },
    {
      id: 'x',
      label: '已備貨',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
      renderRowCell: (columnName, row, option) => {
        return 0;
      },
    },
    {
      id: 'x2',
      label: '追加',
      sortable: false,
      align: 'right',
      padding: 'checkbox',
      size: 100,
      renderRowCell: (columnName, row, option) => {
        return 0;
      },
    },
    // {
    //   id: 'data',
    //   label: '客戶名稱',
    //   sortable: false,
    //   align: 'left',
    //   size: 100,
    // },
    // {
    //   id: 'created_at',
    //   label: '建立時間',
    //   sortable: false,
    //   align: 'right',
    //   renderRowCell,
    //   size: 200,
    // },
    {
      id: 'updated_at',
      // label: '最後更新時間',
      sortable: false,
      align: 'left',
    },
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
  query ProductList {
    products {
      id
      uid
      customId
      group {
        products(where: {deleted_at: {_is_null: true}}) {
          id
          name
        }
        category {
          id
          name
        }
        campaigns(where: {deleted_at: {_is_null: true}}) {
          campaign {
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
          }
        }
      }
      color
      colorName
      colorCode
      size
      thumbnail
      pictures
      name
      price
      weight
      description
      data
      sizeChart
    }
    productAggregate(where: {deleted_at: {_is_null: true}}) {
      aggregate {
        count
      }
    }
  }
`;


const PRODUCT_LIST_SEARCH_QUERY = gql`
  query ProductGroupListSearch($name: String!) {
    products(where: {deleted_at: {_is_null: true}, name: { _ilike: $name }}, order_by: {created_at: desc}) {
      id
      uid
      customId
      group {
        products(where: {deleted_at: {_is_null: true}}) {
          id
          name
        }
        category {
          id
          name
        }
        campaigns(where: {deleted_at: {_is_null: true}}) {
          campaign {
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
          }
        }
      }
      color
      size
      thumbnail
      pictures
      name
      price
      weight
      description
      data
    }
    productAggregate(where: {deleted_at: {_is_null: true}}) {
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
  const gqlQuery = useGqlQuery(
    'products',
    'productAggregate',
    `
      id
      uid
      customId
      group {
        products(where: {deleted_at: {_is_null: true}}) {
          id
          name
        }
        category {
          id
          name
        }
        campaigns(where: {deleted_at: {_is_null: true}}) {
          campaign {
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
          }
        }
      }
      color
      colorName
      size
      thumbnail
      pictures
      name
      instock
      price
      weight
      description
      data
      disabled
      isLimit
      soldout
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
    if (data && data.products) {
      setRows(data.products);
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
      <FilterSection />
      <BasicSection>
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
          renderRowDetail={row => (<DetailTable row={row} products={row.products} />)}
        />
      </BasicSection>
    </React.Fragment>
  );
};
