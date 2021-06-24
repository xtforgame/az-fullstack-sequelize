/* eslint-disable react/sort-comp */
import React, { useState, useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import BasicSection from '~/components/Section/Basic';
// import useRouterQuery from '~/hooks/useRouterQuery';
import useGqlQueryT1 from '~/hooks/useGqlQueryT1';
import useGqlQueryT2 from '~/hooks/useGqlQueryT2';
import useGqlTable, { useTableStates } from '~/containers/hooks/useGqlTable';
import useGqlCrud from '~/containers/hooks/useGqlCrud';
import { CollectionConfig } from '~/domain-logic/resourceHelpers/common';
import useRouterQuery from '~/hooks/useRouterQuery';
import {
  TableProps,
  RowTypeBase,
} from '~/components/ControlledEnhancedTable';

export type Options<RowType extends RowTypeBase = RowTypeBase> = {
  collectionConfig: CollectionConfig;
  Editor: React.FC<any>;
  FilterSection: React.FC<any>;
  DetailTable?: React.FC<any>;
  restProps?: Partial<TableProps<RowType>>,
  [s: string]: any;
}

const useStyles = makeStyles(theme => ({
  root: {
    // maxWidth: 900,
  },
}));

export const createListComponent = (op: Options) => {
  const {
    Editor,
    FilterSection,
    DetailTable,
    collectionConfig: {
      basePath,
      resourceName,
      resourceLabelName,
      collectionName,
      collectionLabelName,
      aggregateName,
      resourceFieldsText,
      getColumnConfig,
      useRenderActions,
      useGqlQueryT1Option = options => ({ options, variables: {} }),
    },
    restProps,
  } = op;
  return (props) => {
    const query = useRouterQuery();
    const [filter, setFilter] = useState<any>(query);
    const tableStates = useTableStates({}, {}, restProps);

    const { options, variables } = useGqlQueryT1Option({
      // args: ['$name: String!'],
      // where: ['{name: {_ilike: $name}}'],
      args: [],
      where: [],
      orderBy: `{${tableStates.orderBy || 'id'}: ${tableStates.order || 'desc'}}`,
      offset: tableStates.page! * tableStates.rowsPerPage!,
      limit: tableStates.rowsPerPage || undefined,
      debug: true,
    }, { filter, tableStates });

    const gqlQuery = useGqlQueryT1(
      collectionName,
      aggregateName,
      resourceFieldsText,
      options,
    );

    const renderActions = useRenderActions({ filter, tableStates });

    const { render } = useGqlTable({
      getQueryConfig: () => ({
        queryData: gqlQuery,
        getQueryOption: refreshCount => ({
          variables: {
            name: '%w%',
            refreshCount: refreshCount.toString(),
            ...variables,
          },
          fetchPolicy: 'network-only',
        }),
        getRowsAndCount: data => ({
          list: data?.[collectionName] || [],
          count: data?.[aggregateName]?.aggregate?.count || 0,
        }),
      }),
      title: `${collectionLabelName}管理`,
      renderActions,
      getColumnConfig,
      rowsPerPageOptions: [10, 25, 50, 75, { value: 0, label: 'All' }],
      renderError: error => (
        <pre>
          取得
          {collectionLabelName}
          列表失敗
          {JSON.stringify(error, null, 2)}
        </pre>
      ),
      renderRowDetail: DetailTable ? (row, _, __, { refresh }) => (
        <DetailTable
          {...props}
          row={row}
          onRefresh={refresh as any}
        />
      ): undefined,
      ...tableStates,
    });

    return (
      <React.Fragment>
        <FilterSection defaultValue={filter} onChange={setFilter as any} />
        <BasicSection>
          {render(props)}
        </BasicSection>
      </React.Fragment>
    );
  };
};

export default (op: Options) => {
  const {
    Editor,
    FilterSection,
    DetailTable,
    collectionConfig: {
      basePath,
      resourceName,
      resourceLabelName,
      collectionName,
      collectionLabelName,
      aggregateName,
      resourceFieldsText,
      getColumnConfig,
      useRenderActions,
      useGqlQueryT1Option = options => ({ options, variables: {} }),
      useStates = () => ({}),
    },
  } = op;
  const extraStates = useStates();
  const ListComponent = useMemo(() => createListComponent(op), []);
  const gqlQuery = useGqlQueryT2(
    resourceName,
    resourceFieldsText,
  );
  const {
    CreateComponent,
    EditComponent,
  } = useGqlCrud({
    Editor,
    getQueryConfig: ({ id }) => ({
      queryData: gqlQuery,
      getQueryOption: refreshCount => ({
        variables: {
          id,
          name: '%w%',
          refreshCount: refreshCount.toString(),
        },
        fetchPolicy: 'network-only',
      }),
      getEditingData: data => data?.[resourceName],
    }),
  });
  const render = (extraProps?) => (
    <Switch>
      <Route
        name="list"
        path={basePath}
        render={p => (
          <ListComponent
            {...p}
            {...extraStates}
            {...extraProps}
          />
        )}
        exact
      />
      <Route
        name="create"
        path={`${basePath}/new`}
        render={p => (
          <CreateComponent
            {...p}
            {...extraStates}
            {...extraProps}
          />
        )}
      />
      <Route
        name="edit"
        path={`${basePath}/edit/:id`}
        render={p => (
          <EditComponent
            {...p}
            {...extraStates}
            {...extraProps}
          />
        )}
      />
    </Switch>
  );
  return {
    render,
  };
};
