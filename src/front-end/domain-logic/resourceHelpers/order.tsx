/* eslint-disable react/sort-comp */
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import ContentText from 'azrmui/core/Text/ContentText';
import {
  // orderStates,
  orderStateNameFunc,
  // orderPayWayNameFunc,
} from 'common/domain-logic/constants/order';
import { renderDateTime } from '~/components/TableShared';
// import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import { Columns, GetColumnConfigResult } from '~/containers/hooks/useGqlTable';
import { CollectionConfig } from './common';

export const basePath = '/order';
export const resourceName = 'order';
export const resourceLabelName = '訂單';
export const collectionName = 'orders';
export const collectionLabelName = '訂單';
export const aggregateName = 'orderAggregate';
export const resourceFieldsText = `
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
`;

export const collectionConfig : CollectionConfig = {
  basePath,
  resourceName,
  resourceLabelName,
  collectionName,
  collectionLabelName,
  aggregateName,
  resourceFieldsText,
  getColumnConfig: () => {
    const columns : Columns = [
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
        renderRowCell: renderDateTime,
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
              <IconButton color="primary" aria-label="修改" onClick={() => push(`${basePath}/edit/${row.id}`)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          );
        },
        size: 64,
      },
    ];

    const data: GetColumnConfigResult = {
      columns,
      defaultSorting: {
        order: 'desc',
        orderBy: 'date',
      },
      // columnSizes: [120, 120, 180, 150, null],
    };
    return data;
  },
  useRenderActions: () => {
    const push = useRouterPush();
    return (numSelected, { refresh }) => (numSelected > 0 ? (
      <React.Fragment>
        <Tooltip title="核准">
          <IconButton
            aria-label="accept"
            onClick={async () => {
              await refresh();
            }}
          >
            <DoneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="駁回">
          <IconButton
            aria-label="reject"
            onClick={async () => {}}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="下載報告">
          <IconButton
            aria-label="download report"
            onClick={async () => {
            }}
          >
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
        {/* <Tooltip title="新增訂單">
          <IconButton color="primary" aria-label="新增訂單" onClick={() => push(`${basePath}/new`)}>
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
  },
  useGqlQueryT1Option: (op, { filter }) => {
    // const query = useRouterQuery();
    // console.log('query :', query);

    const args: string[] = [];
    const where: string[] = [];

    let searchText = '';
    let searchId = 0;
    if (filter && filter.searchText && filter.searchText !== 'all') {
      searchText = `%${filter.searchText}%`;
      searchId = parseInt(filter.searchText) || 0;
      args.push('$searchText: String!');
      if (searchId) {
        args.push('$searchId: bigint!');
      }

      const orArray: string[] = [];
      orArray.push('{ user: { name: { _ilike: $searchText } } }');
      if (searchId) {
        orArray.push('{ id: { _eq: $searchId } }');
      }
      where.push(`{_or: [${orArray.join(',')}]}`);
    }

    let state = 'all';
    if (filter && filter.state && filter.state !== 'all') {
      ({ state } = filter);
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
    return {
      ...op,
      args,
      where,
    };
  },
};

export const x = 1;
