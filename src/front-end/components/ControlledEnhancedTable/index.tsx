import React, { Dispatch, SetStateAction, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Switch from '@material-ui/core/Switch';
// import Fade from '@material-ui/core/Fade';
// import ProgressWithMask from 'azrmui/core/Progress/ProgressWithMask';
import { Overwrite } from 'common/utils';
import EnhancedTableToolbar, { EnhancedTableToolbarProps } from '../TableShared/EnhancedTableToolbar';
import EnhancedTableHead from '../TableShared/EnhancedTableHead';
import EnhancedRow from '../TableShared/EnhancedRow';
import LoadingMask from '../TableShared/LoadingMask';
import {
  RowTypeBase,
  OrderType,
  Columns,
  ColumnSizes,
  RenderRowDetail,
  OnRowCheck,
  GetRowDefaultOpenFunc,
} from '../TableShared/interfaces';

export * from '../TableShared/interfaces';


export type TableStatesBase<RowType extends RowTypeBase = RowTypeBase> = {
  rows: RowType[];
  selected: any[];
  order: OrderType;
  orderBy: string;
  page: number;
  dense: boolean;
  rowsPerPage: number;
}

export type TableStatesBaseWithSetter<RowType extends RowTypeBase = RowTypeBase> = TableStatesBase<RowType> & {
  setRows: Dispatch<SetStateAction<RowType[]>>;
  setSelected: Dispatch<SetStateAction<any[]>>;
  setOrder: Dispatch<SetStateAction<OrderType>>;
  setOrderBy: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
  setDense: Dispatch<SetStateAction<boolean>>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
}

export type TableStates<RowType extends RowTypeBase = RowTypeBase> = {
  [P in keyof Partial<TableStatesBase<RowType>>]: TableStatesBase<RowType>[P];
}

export type TableStatesDefaultValues<RowType extends RowTypeBase = RowTypeBase> = {
  [P in keyof Partial<TableStatesBase<RowType>>]: TableStatesBase<RowType>[P] | (() => TableStatesBase<RowType>[P]);
}


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    position: 'relative',
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    // minWidth: 750,
    tableLayout: 'fixed',
  },
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
  emptyCell: {
    width: '100%',
    height: '50%',
    minHeight: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export type TableBasicProps<RowType extends RowTypeBase = RowTypeBase> = {
  isSimple?: boolean;
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
  hidePagination?: boolean;
  loading?: boolean;
  columns?: Columns;
  columnSizes?: ColumnSizes;
  totalCount?: number;
  toolbarProps?: EnhancedTableToolbarProps;
  renderRowDetail?: RenderRowDetail<RowType>;
  renderEmptyContent?: () => React.ReactNode;
  defaultOpen?: boolean;
  getRowDefaultOpen?: GetRowDefaultOpenFunc<RowType>;
}

export type TableProps<RowType extends RowTypeBase = RowTypeBase> = Overwrite<TableStatesBaseWithSetter<RowType> & TableBasicProps<RowType>, {
  // rows: RowType[];
  selected?: any[];
  order?: OrderType;
  orderBy?: string;
  page?: number;
  // dense: boolean;
  rowsPerPage?: number;
  // setRows: Dispatch<SetStateAction<RowType[]>>;
  setSelected?: Dispatch<SetStateAction<any[]>>;
  setOrder?: Dispatch<SetStateAction<OrderType>>;
  setOrderBy?: Dispatch<SetStateAction<string>>;
  setPage?: Dispatch<SetStateAction<number>>;
  // setDense: Dispatch<SetStateAction<boolean>>;
  setRowsPerPage?: Dispatch<SetStateAction<number>>;
}>;

export type UseTableStatesOptions = {
  isSimple?: boolean;
};

export function useTableStates<RowType extends RowTypeBase = RowTypeBase>(defaults : TableStatesDefaultValues<RowType> = {}, options: UseTableStatesOptions = {}, restProps : Partial<TableProps<RowType>> = {}) : TableProps<RowType> {
  const [rows, setRows] = useState<RowType[]>(defaults.rows || []);
  const [selected, setSelected] = useState<any[]>(defaults.selected || []);

  const [order, setOrder] = useState<OrderType>(defaults.order || 'desc');
  const [orderBy, setOrderBy] = useState<string>(defaults.orderBy || 'id');
  const [page, setPage] = useState<number>(defaults.page || 0);
  const [dense, setDense] = useState<boolean>(defaults.dense != null ? defaults.dense : true);
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaults.rowsPerPage || 10);

  return {
    rows,
    setRows,
    selected: options.isSimple ? undefined : selected,
    setSelected: options.isSimple ? undefined : setSelected,
    order: options.isSimple ? undefined : order,
    setOrder: options.isSimple ? undefined : setOrder,
    orderBy: options.isSimple ? undefined : orderBy,
    setOrderBy: options.isSimple ? undefined : setOrderBy,
    page: options.isSimple ? undefined : page,
    setPage: options.isSimple ? undefined : setPage,
    dense,
    setDense,
    rowsPerPage: options.isSimple ? undefined : rowsPerPage,
    setRowsPerPage: options.isSimple ? undefined : setRowsPerPage,
    ...restProps,
  };
}

export default function EnhancedTable<RowType extends RowTypeBase = RowTypeBase>(props : TableProps<RowType>) {
  const {
    isSimple,
    defaultOpen,

    rows,
    loading,
    totalCount,

    selected = [],
    setSelected,

    order,
    setOrder,

    orderBy,
    setOrderBy,

    page,
    setPage,

    dense,
    setDense,

    rowsPerPage,
    setRowsPerPage,

    toolbarProps,
    rowsPerPageOptions = [10, 25, 50, 75, { value: 0, label: 'All' }],

    columns: columnsProp = [],
    columnSizes: columnSizesProp = [],
    renderRowDetail,
    renderEmptyContent,

    hidePagination,
    getRowDefaultOpen,
  } = props;

  const classes = useStyles();

  const rec = renderEmptyContent || (() => <div className={classes.emptyCell}>{'<No Data>'}</div>);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    if (setOrder && setOrderBy) {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }
  };

  const handleSelectAllClick = setSelected && ((event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  });

  const onRowCheck : OnRowCheck | undefined = setSelected && ((event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected : any[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  });

  const handleChangePage = (event, newPage) => {
    if (setPage) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    if (setRowsPerPage && setPage) {
      setRowsPerPage(parseInt(event.target.value));
      setPage(0);
    }
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  let extraColumnNum = 0;
  if (setSelected != null) {
    extraColumnNum++;
  }
  if (renderRowDetail != null) {
    extraColumnNum++;
  }

  const isSelected = id => selected.indexOf(id) !== -1;

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {(!isSimple || toolbarProps) && (
          <EnhancedTableToolbar
            {...toolbarProps}
            numSelected={selected.length}
          />
        )}
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead<RowType>
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              columns={columnsProp}
              columnSizes={columnSizesProp}
              renderRowDetail={renderRowDetail}
            />
            <TableBody>
              {!rows.length && (
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columnsProp.length + extraColumnNum}>
                    {rec()}
                  </TableCell>
                </TableRow>
              )}
              {rows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <EnhancedRow<RowType>
                    key={row.id}
                    index={index}
                    defaultOpen={defaultOpen}
                    columns={columnsProp}
                    columnSizes={columnSizesProp}
                    renderRowDetail={renderRowDetail}
                    {...({
                      onRowCheck, row, isItemSelected, labelId,
                    })}
                    extraColumnNum={extraColumnNum}
                    getRowDefaultOpen={getRowDefaultOpen}
                  />
                );
              })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        {
          !hidePagination && !isSimple && (
            <TablePagination
              // {...paginationProps}
              rowsPerPageOptions={rowsPerPageOptions}
              component="div"
              count={totalCount || rows.length}
              rowsPerPage={rowsPerPage || 10}
              page={page || 0}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )
        }
        <LoadingMask loading={loading} />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
}
