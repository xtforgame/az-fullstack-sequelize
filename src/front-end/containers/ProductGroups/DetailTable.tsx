import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import useGqlQueryT1 from '~/hooks/useGqlQueryT1';
import useGqlTable, { useTableStates } from '~/containers/hooks/useGqlTable';
import { collectionConfig } from '~/domain-logic/resourceHelpers/product';

const useStyles = makeStyles(theme => ({
  box: {
  },
}));

const columnConfig = collectionConfig.getColumnConfig();
columnConfig.columns.pop();

export default (props) => {
  const {
    row,
  } = props;

  const classes = useStyles();
  const tableStates = useTableStates({}, { isSimple: true });
  const gqlQuery = useGqlQueryT1(
    collectionConfig.collectionName,
    collectionConfig.aggregateName,
    collectionConfig.resourceFieldsText,
    {
      // args: ['$name: String!'],
      // where: ['{name: {_ilike: $name}}'],
      where: [`{group_id: {_eq: ${row.id}}}`],
      orderBy: '{created_at: desc}',
    },
  );
  const { render: renderTable } = useGqlTable({
    isSimple: true,
    title: '商品一覽',
    getColumnConfig: () => columnConfig,
    getQueryConfig: ({ id }) => ({
      queryData: gqlQuery,
      getQueryOption: refreshCount => ({
        variables: {
          name: '%w%',
          refreshCount: refreshCount.toString(),
        },
        fetchPolicy: 'network-only',
      }),
      getRowsAndCount: data => ({
        list: data?.products || [],
        count: data?.productAggregate?.aggregate?.count || 0,
      }),
    }),
    renderError: error => (
      <pre>
        Error
        {JSON.stringify(error, null, 2)}
      </pre>
    ),
    ...tableStates,
  });
  return (
    <React.Fragment>
      <Box className={classes.box} margin={1}>
        {renderTable()}
      </Box>
    </React.Fragment>
  );
};
