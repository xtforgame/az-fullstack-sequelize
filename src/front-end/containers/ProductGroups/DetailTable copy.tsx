import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import useRouterPush from '~/hooks/useRouterPush';
import useTable, {
  useTableStates, GetColumnConfig, Columns, GetColumnConfigResult,
} from '~/containers/hooks/useTable';

const useStyles = makeStyles(theme => ({
  box: {
  },
}));

const getColumnConfig : GetColumnConfig = () => {
  const columns : Columns = [
    {
      id: 'id',
      label: 'ID',
      align: 'left',
      size: 120,
    },
    {
      id: '__action__01',
      label: '',
      sortable: false,
      align: 'right',
      padding: 'none',
      renderRowCell: (columnName, row, option) => {
        const push = useRouterPush();
        const onClick = () => push(`/home/sub02/edit/${row.id}`);
        return (
          <Tooltip title="修改">
            <IconButton color="primary" aria-label="修改" onClick={onClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        );
      },
      size: 48,
    },
    {
      id: '__action__02',
      label: '',
      sortable: false,
      align: 'right',
      padding: 'none',
      renderRowCell: (columnName, row, option) => {
        const push = useRouterPush();
        const onClick = () => push(`/home/sub02/edit/${row.id}`);
        return (
          <Tooltip title="刪除">
            <IconButton color="primary" aria-label="刪除" onClick={onClick}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        );
      },
      size: 48,
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
};


export default (props) => {
  const {
    row,
  } = props;

  const classes = useStyles();
  const tableStates = useTableStates({}, { isSimple: true });

  const { render: renderTable } = useTable({
    isSimple: true,
    title: '商品一覽',
    getColumnConfig,
    renderError: error => (
      <pre>
        Error
        {JSON.stringify(error, null, 2)}
      </pre>
    ),
    ...tableStates,
    rows: row.products,
  });
  return (
    <React.Fragment>
      <Box className={classes.box} margin={1}>
        {renderTable()}
      </Box>
    </React.Fragment>
  );
};
