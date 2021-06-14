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
import { toCurrency } from 'common/utils';
import moment from 'moment';
// import useRouterQuery from '~/hooks/useRouterQuery';
import useRouterPush from '~/hooks/useRouterPush';
import { Columns, GetColumnConfigResult } from '~/containers/hooks/useGqlTable';
import { CollectionConfig } from './common';

export const basePath = '/member';
export const resourceName = 'user';
export const resourceLabelName = '會員';
export const collectionName = 'users';
export const collectionLabelName = '會員';
export const aggregateName = 'userAggregate';
export const resourceFieldsText = `
id
name
email
mobile
signInCount
orderSum: orders_aggregate(where: {deleted_at: {_is_null: true}}) {
  aggregate{
    count
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
        id: 'name',
        label: '姓名',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        size: 200,
      },
      {
        id: 'email',
        label: '信箱',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        size: 300,
      },
      {
        id: 'mobile',
        label: '行動電話',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        size: 120,
      },
      {
        id: 'signInCount',
        label: '登入次數',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        size: 80,
      },
      {
        id: 'orderSum',
        label: '已付款訂單數',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        size: 80,
        rowCellToString: (columnName, row, option) => row.orderSum.aggregate.count,
      },
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
      where.push('{ name: { _ilike: $searchText } }');
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
        startTime,
        endTime,
      }
    };
  },
};

export const x = 1;
