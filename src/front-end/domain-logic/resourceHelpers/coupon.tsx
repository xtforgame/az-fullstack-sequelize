/* eslint-disable react/sort-comp */
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
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
import { renderDateTime } from '~/components/TableShared';
import { CollectionConfig } from './common';

export const basePath = '/coupon';
export const resourceName = 'coupon';
export const resourceLabelName = '購物金';
export const collectionName = 'coupons';
export const collectionLabelName = '購物金';
export const aggregateName = 'couponAggregate';
export const resourceFieldsText = `
id
created_at
isDeduct
memo
price
user {
  id
  name
}
adminUser {
  id
  name
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
      // {
      //   id: 'id',
      //   label: 'ID',
      //   align: 'left',
      //   size: 120,
      // },
      {
        id: 'member',
        label: '會員',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        rowCellToString: (columnName, row, option) => row.user ? row.user.name: '<N/A>',
        renderRowCell: (columnName, row, options) => {
          const {
            toStringFunction,
          } = options;
          const id = row?.user?.id;
          const name = toStringFunction(columnName, row, options);
          return (
            <ContentText>
              <Link
                to={{
                  pathname: '/member',
                  search: `?id=${id}`,
                  state: { fromDashboard: true }
                }}
              >
              {id ? `${name}  (ID: ${id})` : `${name}`}
              </Link>
            </ContentText>
          );
        },
        size: 200,
      },
      {
        id: 'admin',
        label: '管理員',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        rowCellToString: (columnName, row, option) => row.adminUser ? row.adminUser.name: '<N/A>',
        size: 200,
      },
      {
        id: 'price',
        label: '金額',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        rowCellToString: (columnName, row, option) => row.isDeduct ? -row.price : row.price,
        renderRowCell: (columnName, row, option) => (
          <ContentText style={{ backgroundColor: row.isDeduct ? 'rgba(255, 0, 0, 0.5)' : 'none' }}>
            {row.isDeduct ? -row.price : row.price}
          </ContentText>
        ),
        size: 200,
      },
      {
        id: 'memo',
        label: '備註',
        sortable: false,
        align: 'left',
        padding: 'checkbox',
        rowCellToString: (columnName, row, option) => row.memo,
        renderRowCell: (columnName, row, option) => (
          <ContentText>
            {row.memo}
          </ContentText>
        ),
        size: 400,
      },
      {
        id: 'created_at',
        label: '加值時間',
        sortable: false,
        align: 'left',
        renderRowCell: renderDateTime,
        size: 200,
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

    let userId = 0;
    if (filter && filter.userId) {
      userId = filter.userId;
      args.push('$userId: bigint!');
      where.push('{_or: [{ user_id: { _eq: $userId } }]}');
    }

    let searchText = '';
    if (filter && filter.searchText && filter.searchText !== 'all') {
      searchText = `%${filter.searchText}%`;
      args.push('$searchText: String!');
      where.push(`{_or:[
        { user: { name: { _ilike: $searchText } } },
        { adminUser: { name: { _ilike: $searchText } } },
        { memo: { _ilike: $searchText } }
      ]}`);
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
        userId,
        searchText,
        startTime,
        endTime,
      }
    };
  },
};

export const x = 1;
