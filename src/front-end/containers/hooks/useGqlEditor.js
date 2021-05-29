/* This is an example snippet - you should consider tailoring it
to your service.
*/
/*
  Add these to your `package.json`:
    "apollo-boost": "^0.3.1",
    "graphql": "^14.2.1",
    "graphql-tag": "^2.10.0",
    "react-apollo": "^2.5.5"
*/
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
/* eslint-disable react/sort-comp */
import { makeStyles } from '@material-ui/core/styles';
import ControlledEnhancedTable from '~/components/ControlledEnhancedTable';

const useStyles = makeStyles(theme => ({
}));

export default (props) => {
  const {
    getQueryConfig,
    title,
    renderActions,
    getColumnConfig,
    rowsPerPageOptions = [10, 25, 50, 75],
    renderError = error => (
      <pre>
        Error
        {JSON.stringify(error, null, 2)}
      </pre>
    ),
    renderRowDetail: rrd,

    rows = [],
    setRows,
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
  } = props;


  const [refreshCount, setRefreshCount] = useState(0);
  // const classes = useStyles();

  const totalCount = useRef(0);

  // const query = useRouterQuery();
  // console.log('query.get("text") :', query.get('text'));

  const { queryData, getQueryOption, getRowsAndCount } = getQueryConfig({
    orderBy,
    order,
    page,
    rowsPerPage,
  });

  const {
    loading, error, data,
  } = useQuery(queryData, getQueryOption(refreshCount));

  const {
    list, count,
  } = getRowsAndCount(data);

  const refresh = async () => {
    setRefreshCount(refreshCount + 1);
  };

  useEffect(() => {
    if (data && list) {
      setRows(list);
    }
  }, [data]);

  if (!loading) {
    totalCount.current = count;
  }

  const render = () => {
    // if (loading || !data) return <pre>Loading</pre>;
    if (error) {
      return renderError(error);
    }

    const api = {
      refresh,
    };

    const renderRowDetail = rrd && ((...args) => renderRowDetail(...args, api));

    return (
      <ControlledEnhancedTable
        rows={rows}
        loading={loading}
        selected={selected}
        setSelected={setSelected}
        {...getColumnConfig()}
        toolbarProps={{
          title,
          renderActions: numSelected => renderActions(numSelected, api),
        }}
        paginationProps={{
          rowsPerPageOptions,
        }}
        renderRowDetail={renderRowDetail}
        //
        totalCount={totalCount.current || 0}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        page={page}
        setPage={setPage}
        dense={dense}
        setDense={setDense}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    );
  };

  return {
    rows,
    render,
    refresh,
    error,
  };
};
