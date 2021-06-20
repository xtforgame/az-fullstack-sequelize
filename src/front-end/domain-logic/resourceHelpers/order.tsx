/* eslint-disable react/sort-comp */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { toMap } from 'common/utils';
import XLSX from 'xlsx';
import { useQuery, gql } from '@apollo/client';
import { buildQueryT1, Options } from 'common/graphQL';
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
import { Order, Campaign, Product, ShippingFee, calcOrderInfo, toShippingFeeTableMap, ShippingFeeTableMap } from 'common/domain-logic/gql-helpers';
import { renderDateTime } from '~/components/TableShared';
// import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import { Columns, GetColumnConfigResult } from '~/containers/hooks/useGqlTable';
import { CollectionConfig } from './common';
import { sendGraphQLRequest } from './utils';
export const basePath = '/order';
export const resourceName = 'order';
export const resourceLabelName = '訂單';
export const collectionName = 'orders';
export const collectionLabelName = '訂單';
export const aggregateName = 'orderAggregate';
export const resourceFieldsText = `
id
user { id, name }
logistics
countryCode
foreign
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

campaigns {
  campaign {
    type
    data
  }
}
couponRecord {
  id
  price
}

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
    thumbnail
    id
    size
    instock
    orderQuota
    soldout
    weight
    group {
      campaigns {
        campaign {
          id
          type
          data
          name
          state
          start
          end
        }
      }
    }
  }
  soldout
  fulfilled
}
`;

const SHIPPING_FEE_LIST_QUERY = gql`
  query ShippingFees {
    shippingFees(where: {deleted_at: {_is_null: true}}, order_by: {created_at: asc}) {
      id
      price
      countryCode
      weight
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
  useRenderActions: ({ tableStates }) => {
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
        <Button
          variant="outlined"
          color="primary"
          onClick={async (e) => {
            const {
              rows,
              selected,
            } = tableStates;
            const rowMap = toMap(rows!, r => r.id);
            const rowsToDownload = (selected || []).map(s => rowMap[s]);
            const COUNTRIES = {
              hk: "香港",
              mo: "澳門",
              cnn: "中國以北",
              cns: "中國以南",
              my: "馬來西亞",
              sg: "新加坡",
              kr: "韓國",
              jp: "日本",
              us: "美國",
              ca: "加拿大",
              au: "澳洲",
              uk: "英國"
            }
            const toCountryName = countryCode => (COUNTRIES[countryCode] || '')
            console.log('rowsToDownload :', rowsToDownload);
            const header = [
              { title: '訂單編號', get: row => row.id },
              { title: '收件人姓名', get: row => row.recipient.name },
              { title: '收件人手機', get: row => row.recipient.mobile },
              { title: '收件人電話', get: row => row.recipient.phone1 },
              { title: '郵遞區號', get: row => row.recipient.zipcode },
              { title: '區域', get: row => row.recipient.area },
              { title: '地址', get: row => `${ row.logisticsType == 'oversea' ? `${toCountryName(row.recipient.country)} ` : '' }${ row.recipient.zipcode } ${ row.recipient.area } ${ row.recipient.address }` },
              { title: '指定收件時間（編號）', get: row => row.recipient.preferTime },
              { title: '備註', get: row => row.recipient.memo },
              { title: '公司名稱', get: row => row.buyer.company },
            ];
            const transform = row => header.reduce((m, h) => {
              return ({ ...m, [h.title]: h.get(row) });
            }, {});
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(rowsToDownload.map(transform), { header: header.map(h => h.title) });
            const wscols = header.map(h => ({ wch: 20 }));
            ws['!cols'] = wscols;
      
            XLSX.utils.book_append_sheet(wb, ws, '出貨單');
            XLSX.writeFile(wb, `shipping.xlsx`);
          }}
          style={{ flexShrink: 0 }}
        >
          下載出貨單給物流
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={async (e) => {
            const {
              rows,
              selected,
            } = tableStates;
            const rowMap = toMap(rows!, r => r.id);
            const rowsToExport = (selected || []).map(s => rowMap[s]);

            const form = document.createElement('form');
            form.method = 'post';
            form.action = `/account/orders/shipping_list`;
            form.target = '_blank';
            rowsToExport.forEach((r, i) => {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = `orders[${i}]`;
              hiddenField.value = r.id;
              form.appendChild(hiddenField);
            });
            document.body.appendChild(form);
            form.submit();
            setTimeout(() => {
              form.remove();
            }, 0);
          }}
          style={{ flexShrink: 0 }}
        >
          下載出貨單給買家
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={async (e) => {
            const {
              rows,
              selected,
            } = tableStates;
            
            const {
              buildQueryString,
            } = buildQueryT1(
              'shippingFees',
              null,
              `
                id
                price
                countryCode
                weight
              `,
            );

            const { data } = await sendGraphQLRequest<{shippingFees: ShippingFee[]}>(buildQueryString());
            const shippingFeeTableMap = toShippingFeeTableMap(data!.shippingFees);

            const rowMap = toMap(rows!, r => r.id);
            const rowsToDownload = (selected || []).map(s => rowMap[s]);
            const priceInfoArray = rowsToDownload.map(r => calcOrderInfo(r as any, shippingFeeTableMap));
            const priceInfoMap = toMap(priceInfoArray, (_, i) => rowsToDownload[i].id);
            
            const header = [
              { title: '商家帳號', get: row => '54136807' },
              { title: '商家訂單編號', get: row => row.id },
              { title: '消費者身分證/買方統編', get: row => row.taxid || '' },
              { title: '消費者名稱/公司名稱', get: row => row.company || row.recipient.name },
              { title: '買方Email', get: row => row.buyer.email },
              { title: '單價', get: row => priceInfoMap[row.id].originalPrice - priceInfoMap[row.id].couponDiscount },
              { title: '單品數量', get: row => 1 },
              { title: '小計', get: row => priceInfoMap[row.id].originalPrice - priceInfoMap[row.id].couponDiscount },
              { title: '商品描述', get: row => `衣物${priceInfoMap[row.id].totalQuantity}件` },
              { title: '是否三聯', get: row => (row.logistics !== 'oversea') && row.buyer.taxid && row.buyer.company ? 'TRUE' : 'FALSE'  },
              { title: '是否紙本', get: row => 'FALSE' },
              { title: '愛心碼', get: row => '' },
              { title: '載具', get: row => '' },
              { title: '寄送地址', get: row => '' },
              { title: '消費者手機', get: row => '' },
              { title: '備註', get: row => priceInfoMap[row.id].couponDiscount ? `使用購物金：${priceInfoMap[row.id].couponDiscount}元` : '' },
            ];
            const transform = row => header.reduce((m, h) => {
              return ({ ...m, [h.title]: h.get(row) });
            }, {});
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(rowsToDownload.map(transform), { header: header.map(h => h.title) });
            const wscols = header.map(h => ({ wch: 20 }));
            ws['!cols'] = wscols;
      
            XLSX.utils.book_append_sheet(wb, ws, '電子發票檔');
            XLSX.writeFile(wb, `shipping.xlsx`);
          }}
          style={{ flexShrink: 0 }}
        >
          下載電子發票檔
        </Button>
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

    let searchId = 0;
    if (filter && filter.id) {
      searchId = filter.id;
      args.push('$searchId: bigint!');
      where.push('{ id: { _eq: $searchId } }');
    }

    let searchText = '';
    if (filter && filter.searchText && filter.searchText !== 'all') {
      searchText = `%${filter.searchText}%`;
      args.push('$searchText: String!');
      where.push('{ user: { name: { _ilike: $searchText } } }');
    }

    let logistics = 'all';
    if (filter && filter.logistics && filter.logistics !== 'all') {
      ({ logistics } = filter);
      args.push('$logistics: String!');
      where.push('{ logistics: { _eq: $logistics } }');
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
      options: {
        ...op,
        args,
        where,
      },
      variables: {
        searchId,
        searchText,
        state,
        logistics,
        startTime,
        endTime,
      }
    };
  },
  useStates: () => {
    const [refreshCount, setRefreshCount] = useState(0);
    const [shippingFeeTableMap, setShippingFeeTableMap] = useState<ShippingFeeTableMap | undefined>();
    const refresh = async () => {
      setRefreshCount(refreshCount + 1);
    };
    const { loading, error, data } = useQuery(SHIPPING_FEE_LIST_QUERY, {
      variables: {
        name: refreshCount.toString(),
      },
      fetchPolicy: 'network-only',
    });
    useEffect(() => {
      if (data?.shippingFees) {
        const sftm = toShippingFeeTableMap(data?.shippingFees);
        setShippingFeeTableMap(sftm);
      } else {
        setShippingFeeTableMap(undefined);
      }
    }, [data]);
    return {
      shippingFeeTableMap,
      shippingFeesQuery: {
        loading, error, data, refresh,
      },
    };
  }
};

export const x = 1;
