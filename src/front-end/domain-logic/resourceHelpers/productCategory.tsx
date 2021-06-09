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

export const basePath = '/product-category';
export const resourceName = 'productCategory';
export const resourceLabelName = '商品分類';
export const collectionName = 'productCategories';
export const collectionLabelName = '商品分類';
export const aggregateName = 'productCategoryAggregate';
export const resourceFieldsText = `
id
name
nameEn
priority
active
data

code
specsText
specPic
specsDesc
modelsReference1
modelsReference2
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
        id: 'name',
        label: '商品分類名稱',
        sortable: false,
        align: 'left',
        size: 200,
      },
      {
        id: 'active',
        label: '是否顯示',
        sortable: false,
        align: 'left',
        size: 200,
        renderRowCell: (columnName, row, option) => (
          <ContentText>
            {row[columnName] ? '顯示中' : '不顯示'}
          </ContentText>
        ),
      },
      {
        id: 'priority',
        label: '順序(數字大的在上)',
        sortable: false,
        align: 'left',
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
              <IconButton color="primary" aria-label="修改" onClick={() => push(`/product-category/edit/${row.id}`)}>
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
