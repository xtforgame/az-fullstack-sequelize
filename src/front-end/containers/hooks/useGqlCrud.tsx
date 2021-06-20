import React, { useEffect, useMemo, useState, ReactNode } from 'react';
import { useQuery, gql } from '@apollo/client';
import BasicSection from '~/components/Section/Basic';
import LoadingMask from '~/components/TableShared/LoadingMask';

export type Options = {
  Editor?: React.FC<any>;
  Section?: React.FC<any>;
  getQueryConfig: Function;
  renderError?: (error?: Error) => ReactNode;
  [s: string]: any;
}

export const DefaultEditor = () => <div />;

export const createEditComponent = ({
  Editor = DefaultEditor,
  getQueryConfig,
  Section = BasicSection,
  renderError = error => (
    <pre>
      Error
    </pre>
  ),
} : Options) => ((props) => {
  const [refreshCount, setRefreshCount] = useState(0);

  const {
    match,
  } = props;

  const {
    id,
  } = match.params;


  const { queryData, getQueryOption, getEditingData } = getQueryConfig({
    id,
  });

  const {
    loading, error, data,
  } = useQuery(queryData, getQueryOption(refreshCount));


  // if (loading || !data) return <pre>Loading</pre>;
  if (error) {
    return renderError(error);
  }

  const refresh = async () => {
    setRefreshCount(refreshCount + 1);
  };

  const editingData = getEditingData(data);

  return (
    <Section withMaxWith>
      {(!loading && !error && editingData) && (
        <Editor
          {...props}
          editingData={editingData}
          refresh={refresh}
        />
      )}
      <LoadingMask loading={loading || !data} />
    </Section>
  );
}) as React.FC<any>;


export default (op: Options) => {
  const {
    Editor = DefaultEditor,
  } = op;
  const CreateComponent = Editor;
  const EditComponent = useMemo(() => createEditComponent(op), []);
  return {
    CreateComponent,
    EditComponent,
  };
};
