import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';

export default function EnhancedRow({
  columns,
  columnSizes,
  handleClick,
  row,
  index,
  isItemSelected,
  labelId,
  renderRowDetail,
  extraColumnNum,
}) {
  const [open, setOpen] = React.useState(false);
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
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ 'aria-labelledby': labelId }}
            onClick={event => event.stopPropagation()}
            onChange={event => handleClick(event, row.id)}
          />
        </TableCell>
        {/* <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.name}
        </TableCell> */}
        {
          columns.map((column, i) => {
            const style = (columnSizes && columnSizes[i] != null) ? { width: columnSizes[i] } : {};
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
