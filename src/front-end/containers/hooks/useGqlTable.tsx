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
import { RowTypeBase } from '~/components/ControlledEnhancedTable';
import useTable, { TablePropsEx } from './useTable';

export * from './useTable';

export type GqlTableProps<RowType extends RowTypeBase = RowTypeBase> = TablePropsEx<RowType> & {
  getQueryConfig: Function;
};

export default function <RowType extends RowTypeBase = RowTypeBase> (props: GqlTableProps<RowType>) {
  const {
    getQueryConfig,
    ...rest
  } = props;

  const {
    orderBy,
    order,
    page,
    rowsPerPage,
    setRows,
  } = rest;


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

  const tableResult = useTable({
    ...rest,
    totalCount: totalCount.current || 0,
    loading,
    refresh,
    error,
  });

  return {
    ...tableResult,
    error,
  };
}
