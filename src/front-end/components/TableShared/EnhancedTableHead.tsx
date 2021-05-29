import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {
  OrderType,
  Columns,
  RenderRowDetail,
  RowTypeBase,
  ColumnSizes,
  OnRequestSort,
} from './shared';

const useStyles = makeStyles(theme => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));


export type EnhancedTableHeadProps<RowType extends RowTypeBase = RowTypeBase> = {
  title?: string;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  renderRowDetail?: RenderRowDetail<RowType>;
  onRequestSort?: OnRequestSort;
  numSelected?: number;
  rowCount?: number;
  columns?: Columns;
  columnSizes?: ColumnSizes;
  order?: OrderType;
  orderBy?: string;
};

export default function EnhancedTableHead<RowType extends RowTypeBase = RowTypeBase>(props : EnhancedTableHeadProps<RowType>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected = 0,
    rowCount = 0,
    onRequestSort = () => null,
    columns = [],
    columnSizes = [],
    renderRowDetail,
  } = props;
  const classes = useStyles();
  const createSortHandler = property => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {
          renderRowDetail && (
            <TableCell padding="checkbox">
              <div />
            </TableCell>
          )
        }
        {
          onSelectAllClick && (
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{ 'aria-label': 'select all desserts' }}
              />
            </TableCell>
          )
        }
        {columns.map((column, i) => {
          const style : React.CSSProperties = ((columnSizes && columnSizes[i] != null) ? { width: columnSizes[i] } : {}) as any;
          if (column.size != null) {
            style.width = column.size;
          }
          let render = () => (
            <TableSortLabel
              active={orderBy === column.id}
              direction={orderBy === column.id ? order : 'asc'}
              onClick={createSortHandler(column.id)}
            >
              {column.label}
              {orderBy === column.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          );
          if (column.sortable !== undefined && !column.sortable) {
            render = () => column.label as any;
          }

          return (
            <TableCell
              key={column.id}
              align={column.align ? column.align : 'left'}
              padding={column.padding || 'default'}
              sortDirection={orderBy === column.id ? order : false}
              style={style}
            >
              {render()}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
