/* eslint-disable react/sort-comp */
import React from 'react';
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
// import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import { Columns, GetColumnConfigResult } from '~/containers/hooks/useGqlTable';
import { CollectionConfig } from './common';

export const basePath = '/product-group';
export const resourceName = 'productGroup';
export const resourceLabelName = '商品群組';
export const collectionName = 'productGroups';
export const collectionLabelName = '商品群組';
export const aggregateName = 'productGroupAggregate';
export const resourceFieldsText = `
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
        label: '群組編號',
        align: 'left',
        size: 120,
      },
      {
        id: 'name',
        label: '商品群組名稱',
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
