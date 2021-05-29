import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import {
  Columns,
  RenderRowDetail,
  RowTypeBase,
  ColumnSizes,
  OnRowCheck,
} from './shared';

export type EnhancedTableRowProps<RowType extends RowTypeBase = RowTypeBase> = {
  renderRowDetail?: RenderRowDetail<RowType>;
  index: number;
  row: RowType;
  onRowCheck?: OnRowCheck;
  isItemSelected: boolean;
  extraColumnNum?: number;
  labelId?: string;
  numSelected?: number;
  rowCount?: number;
  columns?: Columns;
  columnSizes?: ColumnSizes;
  defaultOpen?: boolean;
};

export default function EnhancedRow<RowType extends RowTypeBase = RowTypeBase>({
  columns = [],
  columnSizes = [],
  onRowCheck,
  row,
  index,
  isItemSelected,
  labelId = 'ckb',
  renderRowDetail,
  extraColumnNum = 0,
  defaultOpen,
} : EnhancedTableRowProps<RowType>) {
  const [open, setOpen] = React.useState(defaultOpen || false);
  const options = {
    columns,
    columnSizes,
  };
  return (
    <React.Fragment>
      <TableRow
        hover
        // onClick={event => handleClick(event, row.name)}
        onClick={() => setOpen(!open)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
      >
        {
          renderRowDetail && (
            <TableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          )
        }
        {
          onRowCheck && (
            <TableCell padding="checkbox">
              <Checkbox
                checked={isItemSelected}
                inputProps={{ 'aria-labelledby': labelId }}
                onClick={event => event.stopPropagation()}
                onChange={event => onRowCheck(event, row.id)}
              />
            </TableCell>
          )
        }
        {/* <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.name}
        </TableCell> */}
        {
          columns.map((column, i) => {
            const style : React.CSSProperties = ((columnSizes && columnSizes[i] != null) ? { width: columnSizes[i] } : {}) as any;
            if (column.size != null) {
              style.width = column.size;
            }
            const toStringFunction = row.cellToString
              || column.rowCellToString
              || ((columnId, row) => row[columnId]);
            const renderFunction = row.renderCell
              || column.renderRowCell
              || ((columnId, row, options) => toStringFunction(columnId, row, options));

            return (
              <TableCell
                key={column.id}
                padding={column.padding || 'default'}
                align={column.align ? column.align : 'left'}
                style={style}
              >
                {renderFunction(column.id, row, {
                  ...options,
                  toStringFunction,
                })}
              </TableCell>
            );
          })
        }
        {/* <TableCell>{row.account}</TableCell>
        <TableCell align="right">{row.shipmentId}</TableCell>
        <TableCell align="right">{row.date}</TableCell>
        <TableCell align="right">{row.comment}</TableCell> */}
      </TableRow>
      {renderRowDetail && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + extraColumnNum}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {
                renderRowDetail(row, index, {
                  columns,
                  columnSizes,
                })
              }
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
