/* eslint-disable react/sort-comp */
import { GetColumnConfig, RenderAction } from '~/containers/hooks/useGqlTable';
import { TableStates } from '~/containers/hooks/useGqlTable';
import { OptionsT1 } from '~/hooks/useGqlQueryT1';

export type CollectionConfig = {
  basePath: string;
  resourceName: string;
  resourceLabelName?: string;
  collectionName: string;
  collectionLabelName: string;
  aggregateName: string;
  resourceFieldsText: string;
  getColumnConfig: GetColumnConfig;
  useRenderActions: () => RenderAction | undefined;
  useGqlQueryT1Option?: (opt : OptionsT1, extraOpt: {
    filter: any;
    tableStates: TableStates,
    [s: string]: any;
  }) => OptionsT1;
};
