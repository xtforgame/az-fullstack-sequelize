/* eslint-disable react/sort-comp */
import React, { useState } from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import FileSaver from 'file-saver';
import ContentText from 'azrmui/core/Text/ContentText';
import { toCurrency } from 'common/utils';
// import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import { Columns, GetColumnConfigResult } from '~/containers/hooks/useGqlTable';
import { CollectionConfig } from './common';
import XInput from './XInput';

export const basePath = '/product';
export const resourceName = 'product';
export const resourceLabelName = '商品';
export const collectionName = 'products';
export const collectionLabelName = '商品';
export const aggregateName = 'productAggregate';
export const resourceFieldsText = `
id
uid
customId
group {
  id
  name
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
priority
description
data
disabled
isLimit
soldout
assignedQuantitySum: orders_aggregate(where: {deleted_at: {_is_null: true}, order: {state: {_eq: "paid"}}}) {
  aggregate {
    sum {
      assignedQuantity
    }
  }
}
quantitySum: orders_aggregate(where: {deleted_at: {_is_null: true}, order: {state: {_eq: "paid"}}}) {
  aggregate {
    sum {
      quantity
    }
  }
}
priceSum: orders_aggregate(where: {deleted_at: {_is_null: true}, soldout: {_eq: false}, fulfilled: {_eq: true}}) {
  aggregate {
    sum {
      subtotal
    }
  }
}
orderSum: orders_aggregate(where: {deleted_at: {_is_null: true}}) {
  aggregate{
    sum {
      quantity
    }
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
        label: 'ID',
        align: 'left',
        size: 120,
      },
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
          return (
            <div style={{ display: 'flex' }}>
              <div style={{
                marginRight: 12, width: 24, height: 24, border: '1px solid black', backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
              }}
              />
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
        renderRowCell: (columnName, row, option) => toCurrency(row[columnName]),
      },
      {
        id: 'disabled',
        label: '狀態',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => (row[columnName] ? '下架' : ''),
      },
      {
        id: 'isLimit',
        label: '限量',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => (row[columnName] ? '是' : ''),
      },
      {
        id: 'soldout',
        label: '斷貨',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => (row[columnName] ? '是' : ''),
      },
      {
        id: 'instock',
        label: '庫存',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => row[columnName],
      },
      {
        id: 'x',
        label: '已備貨',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => row.assignedQuantitySum.aggregate.sum.quantity || 0,
      },
      {
        id: 'x2',
        label: '追加',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => {
          const needed = row.quantitySum.aggregate.sum.quantity || 0;
          const assigned = row.assignedQuantitySum.aggregate.sum.quantity || 0;
          const instock = row.instock || 0;
          if (instock + assigned >= needed) {
            return 0;
          }
          return needed - (instock + assigned);
        },
      },
      {
        id: 'orderSum',
        label: '已售',
        sortable: false,
        align: 'right',
        padding: 'checkbox',
        size: 80,
        renderRowCell: (columnName, row, option) => row.orderSum.aggregate.sum.quantity || 0,
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
        id: 'priority',
        label: '排序',
        sortable: true,
        align: 'right',
        padding: 'checkbox',
        renderRowCell: (columnName, row, option) => {
          if (!row) {
            console.log('row :', row);
          }
          const submit = async (val) => {
            const priority = parseInt(val);
            if (!priority) {
              throw new Error('錯誤的排序');
            }
            const { data } = await axios({
              method: 'patch',
              url: `api/products/${row.id}/priority`,
              data: {
                priority,
              },
            });
            if (data?.priority) {
              return data.priority;
            }
            throw new Error(data.error || '更新失敗');
          };
          return (
            <div style={{ display: 'flex' }}>
              <XInput
                label="排序"
                margin="dense"
                fullWidth
                value={row.priority}
                submit={submit}
              />
              {/* <Tooltip title="修改">
                <IconButton color="primary" aria-label="修改" onClick={() => push(`${basePath}/edit/${row.id}`)}>
                  <EditIcon />
                </IconButton>
              </Tooltip> */}
            </div>
          );
        },
        size: 160,
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
              <IconButton color="primary" aria-label="修改" onClick={() => push(`${basePath}/edit/${row.id}`)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          );
        },
        size: 64,
      },
    ];

    const data : GetColumnConfigResult = {
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
            onClick={async () => {
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="下載報告">
          <IconButton
            aria-label="download report"
            onClick={async () => {
              FileSaver.saveAs('x.xls', 'x.xls');
            }}
          >
            <SaveAltIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Tooltip title={`新增${resourceLabelName}`}>
          <IconButton color="primary" aria-label={`新增${resourceLabelName}`} onClick={() => push(`${basePath}/new`)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="重新整理">
          <IconButton aria-label="重新整理" onClick={refresh as any}>
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
  },
};

export const x = 1;
