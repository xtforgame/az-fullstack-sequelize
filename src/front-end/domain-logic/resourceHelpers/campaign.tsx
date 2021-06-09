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
import { renderDateTime } from '~/components/TableShared';
// import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import { Columns, GetColumnConfigResult } from '~/containers/hooks/useGqlTable';
import { CollectionConfig } from './common';

export const basePath = '/campaign';
export const resourceName = 'campaign';
export const resourceLabelName = '活動';
export const collectionName = 'campaigns';
export const collectionLabelName = '活動';
export const aggregateName = 'campaignAggregate';
export const resourceFieldsText = `
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
        renderRowCell: renderDateTime,
        size: 200,
      },
      {
        id: 'end',
        label: '結束時間',
        sortable: false,
        align: 'right',
        renderRowCell: renderDateTime,
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
      //   renderRowCell: renderDateTime,
      //   size: 200,
      // },
      // {
      //   id: 'updated_at',
      //   label: '最後更新時間',
      //   sortable: false,
      //   align: 'right',
      //   renderRowCell: renderDateTime,
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
