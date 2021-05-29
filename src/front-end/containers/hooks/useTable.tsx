import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { Overwrite } from 'common/utils';
import { useQuery, ApolloError } from '@apollo/client';
/* eslint-disable react/sort-comp */
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import ControlledEnhancedTable, {
  RowTypeBase,
  OrderType,
  TableStatesBaseWithSetter,
  TableStatesDefaultValues,
  Columns,
  RenderRowOption,
  RenderRowDetail as RRD,
  TableProps,
} from '~/components/ControlledEnhancedTable';
import useRouterPush from '~/hooks/useRouterPush';

export * from '~/components/ControlledEnhancedTable';

const useStyles = makeStyles(theme => ({
}));

export const renderHeaderRefreshButton = (numSelected, { refresh }) => numSelected === 0 && (
  <Tooltip title="重新整理">
    <IconButton aria-label="重新整理" onClick={refresh}>
      <RefreshIcon />
    </IconButton>
  </Tooltip>
);

export const createHeaderActionsFucntion = ({ push, path } : any = {}) => (numSelected, options) => (numSelected > 0 ? (
  <React.Fragment />
) : (
  <React.Fragment>
    <Tooltip title="新增">
      <IconButton
        color="primary"
        aria-label="新增"
        onClick={() => {
          if (push) {
            push(path || '');
          }
        }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
    {renderHeaderRefreshButton(numSelected, options)}
  </React.Fragment>
));

export type RenderActionApi = {
  refresh: Function;
};

export type RenderAction = (numSelected: number, api: RenderActionApi) => ReactNode;

export type RenderRowDetail<RowType extends RowTypeBase = RowTypeBase> = (row: RowType, index: number, option: RenderRowOption, api: RenderActionApi) => ReactNode;

export type GetColumnConfig = () => {
  columns: Columns;
  defaultSorting: {
    order: OrderType;
    orderBy: string;
  },
};

export type TablePropsEx<RowType extends RowTypeBase = RowTypeBase> = Overwrite<TableProps<RowType>, {
  title?: string;
  getColumnConfig: GetColumnConfig;
  error?: Error;
  renderActions?: RenderAction;
  renderRowDetail?: RenderRowDetail;
  renderError?: (error?: Error) => ReactNode;
  refresh?: Function;
}>;

export default function <RowType extends RowTypeBase = RowTypeBase> (props: TablePropsEx<RowType>) {
  const {
    title,
    error,
    renderActions = (() => null) as any,
    getColumnConfig,
    rowsPerPageOptions = [10, 25, 50, 75],
    renderError = error => (
      <pre>
        Error
      </pre>
    ),
    renderRowDetail: rrd,
    refresh = () => null,
    ...rest
  } = props;

  const render = () => {
    // if (loading || !data) return <pre>Loading</pre>;
    if (error) {
      return renderError(error);
    }

    const api = {
      refresh,
    };

    const renderRowDetail : RRD<RowType> | undefined = rrd && ((row: RowType, index: number, option: RenderRowOption) => rrd(row, index, option, api));

    return (
      <ControlledEnhancedTable<RowType>
        {...getColumnConfig()}
        toolbarProps={(title || !rest.isSimple) ? {
          title,
          renderActions: numSelected => renderActions(numSelected, api),
        } : undefined}
        rowsPerPageOptions={rowsPerPageOptions}
        renderRowDetail={renderRowDetail}
        //
        {...rest}
      />
    );
  };

  return {
    render,
    refresh,
  };
}
