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

export type Options = {
  collectionConfig: CollectionConfig;
  Editor: React.FC<any>;
  FilterSection: React.FC<any>;
  DetailTable: React.FC<any>;
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
      useGqlQueryT1Option = o => o,
    },
  } = op;
  return (props) => {
    const [filter, setFilter] = useState<any>({});
    const tableStates = useTableStates({});

    const optT1 = useGqlQueryT1Option({
      // args: ['$name: String!'],
      // where: ['{name: {_ilike: $name}}'],
      args: [],
      where: [],
      orderBy: `{${tableStates.orderBy || 'id'}: ${tableStates.order || 'desc'}}`,
      offset: tableStates.page! * tableStates.rowsPerPage!,
      limit: tableStates.rowsPerPage,
      debug: true,
    }, { filter, tableStates });

    const gqlQuery = useGqlQueryT1(
      collectionName,
      aggregateName,
      resourceFieldsText,
      optT1,
    );

    const renderActions = useRenderActions();

    const { render } = useGqlTable({
      getQueryConfig: () => ({
        queryData: gqlQuery,
        getQueryOption: refreshCount => ({
          variables: {
            name: '%w%',
            refreshCount: refreshCount.toString(),
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
      rowsPerPageOptions: [10, 25, 50, 75],
      renderError: error => (
        <pre>
          取得
          {collectionLabelName}
          列表失敗
          {JSON.stringify(error, null, 2)}
        </pre>
      ),
      renderRowDetail: (row, _, __, { refresh }) => (
        <DetailTable
          row={row}
          onRefresh={refresh as any}
        />
      ),
      ...tableStates,
    });

    return (
      <React.Fragment>
        <FilterSection defaultValue={filter} onChange={setFilter as any} />
        <BasicSection>
          {render()}
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
      useGqlQueryT1Option = o => o,
    },
  } = op;
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
  const render = () => (
    <Switch>
      <Route
        name="list"
        path={basePath}
        component={ListComponent}
        exact
      />
      <Route
        name="create"
        path={`${basePath}/new`}
        component={CreateComponent}
      />
      <Route
        name="edit"
        path={`${basePath}/edit/:id`}
        component={EditComponent}
      />
    </Switch>
  );
  return {
    render,
  };
};
