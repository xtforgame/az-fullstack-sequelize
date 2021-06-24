/* eslint-disable react/sort-comp */
import { GetColumnConfig, RenderAction } from '~/containers/hooks/useGqlTable';
import { TableStates } from '~/containers/hooks/useGqlTable';
import { OptionsT1 } from '~/hooks/useGqlQueryT1';
import {
  TableProps,
} from '~/components/ControlledEnhancedTable';

export type ExtraOptions = {
  filter: any;
  tableStates: TableStates,
  [s: string]: any;
};

export type CollectionConfig = {
  basePath: string;
  resourceName: string;
  resourceLabelName?: string;
  collectionName: string;
  collectionLabelName: string;
  aggregateName: string;
  resourceFieldsText: string;
  getColumnConfig: GetColumnConfig;
  useRenderActions: (extraOpt: ExtraOptions) => RenderAction | undefined;
  useGqlQueryT1Option?: (opt : OptionsT1, extraOpt: ExtraOptions) => {
    options: OptionsT1,
    variables: any,
  };
  useStates?: () => { [s: string]: any; };
  getTableRestProps?: () => Partial<TableProps>,
};
