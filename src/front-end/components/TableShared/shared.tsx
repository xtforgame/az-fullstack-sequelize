import React, { ReactNode } from 'react';
import { TableCellProps, Padding } from '@material-ui/core/TableCell';

export type OrderType = 'asc' | 'desc';

export type ColumnSize = (number | string | null);

export type RenderRowCell = (columnName, row, option) => React.ReactNode;

export type ColumnSizes = ColumnSize[];

export type Column<RowType = any> = {
  id: string;
  label?: string;
  sortable?: boolean;
  align?: TableCellProps['align'],
  padding?: Padding;
  size?: ColumnSize;
  rowCellToString?: (cloumn: string, row: RowType, option: {
    columns: Column<RowType>[];
    columnSizes: ColumnSizes,
  }) => string;
  renderRowCell?: (columnName: string, row: RowType, option: {
    columns: Column<RowType>[];
    columnSizes: ColumnSizes;
    toStringFunction: (cloumn: string, row: RowType, option: {
      columns: Column<RowType>[];
      columnSizes: ColumnSizes,
    }) => string;
  }) => ReactNode;
};

export type Columns = Column[];

export type RenderRowOption = {
  columns: Columns;
  columnSizes: ColumnSizes;
}

export type RowTypeBase = {
  id: any;
  cellToString?: <RowType extends RowTypeBase = RowTypeBase>(cloumn: string, row: RowType, option: RenderRowOption) => string;
  renderCell?: <RowType extends RowTypeBase = RowTypeBase>(cloumn: string, row: RowType, option: RenderRowOption & {
    toStringFunction: (cloumn: string, row: RowType, option: RenderRowOption) => string;
  }) => ReactNode;
}

export type RenderRowDetail<RowType extends RowTypeBase = RowTypeBase> = (row: RowType, index: number, option: RenderRowOption) => ReactNode;

export type RenderAction = (numSelected: number) => ReactNode;

export type OnRequestSort = (e: Event, x: string) => void;

export type OnRowCheck = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
