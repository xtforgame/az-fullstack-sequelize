import {
  CommonConfig,
  QueryBuilderDefinition,
  QcStore,

  BaseSelector,
  BuiltinSelectorCreators,
  BuiltinSelectors,

  FeatureGroup,
  FeatureGroupTypes,
} from 'querchy';

import CrudT1 from 'querchy/exports/features/CrudT1';
import UpdateCacheT1 from 'querchy/exports/features/UpdateCacheT1';
import CollectionT1 from 'querchy/exports/features/CollectionT1';

import {
  MakeResourceModelType,
  TypeHelperClass,
} from 'querchy/exports/type-helpers';

/*
  the name ends with "DS" means it's a domain specific type/class
*/

export type CrudUpdateCacheCollectionTypesDS = FeatureGroupTypes<
  CrudT1,
  UpdateCacheT1,
  CollectionT1
>;

export type StateDS = any;

export interface CommonConfigDS extends CommonConfig {}

export type CommonResourceModelDS = MakeResourceModelType<
  CommonConfigDS,
  FeatureGroup<CrudUpdateCacheCollectionTypesDS>
>;

export type ModelMapDS = {
  systemInfo: CommonResourceModelDS;
  session: CommonResourceModelDS;
  accountLink: CommonResourceModelDS;
  user: CommonResourceModelDS;
  userSetting: CommonResourceModelDS;
  recoveryToken: CommonResourceModelDS;
  challengeRecoveryToken: CommonResourceModelDS;
  resetPasswordRequest: CommonResourceModelDS;
  organization: CommonResourceModelDS;
  project: CommonResourceModelDS;
  memo: CommonResourceModelDS;
  contactUsMessage: CommonResourceModelDS;
};

export type QueryBuilderMapDS = {
  defaultBuilder : QueryBuilderDefinition<CommonConfigDS, ModelMapDS>;
  forExtra : QueryBuilderDefinition<CommonConfigDS, ModelMapDS>;
};

// ===========================================

export type ExtraSelectorCreatorCreatorDS<ReturnType> = (
  baseSelector : BaseSelector<ModelMapDS>,
  builtinSelectorCreators: BuiltinSelectorCreators<StateDS>,
  builtinSelectors: BuiltinSelectors<StateDS>,
) => () => (state : any) => ReturnType;

export type ExtraSelectorInfoForModelDS<ReturnType> = {
  creatorCreator: ExtraSelectorCreatorCreatorDS<ReturnType>,
};

export type ExtraSelectorInfosForModelDS = {
  systemInfo: {
    selectSystemInfo: ExtraSelectorInfoForModelDS<any>,
  },
  session: {
    selectMe: ExtraSelectorInfoForModelDS<any>,
    selectIsAuthenticated: ExtraSelectorInfoForModelDS<boolean>,
  },
  user: {
    selectMyUser: ExtraSelectorInfoForModelDS<any>,
  },
  organization: {
    selectCurrentOrganization: ExtraSelectorInfoForModelDS<any>,
  },
};

// ===========================================

export const typeHelperClassDS = new TypeHelperClass<
  CommonConfigDS,
  ModelMapDS,
  QueryBuilderMapDS,
  {}, // ExtraQueryInfosDS,
  {}, // ExtraActionInfosDS,

  any, // ExtraDependenciesDS,
  StateDS,
  ExtraSelectorInfosForModelDS
>();

export type StoreDS = QcStore<StateDS>;

// ===========================================

// you can do inheritance here
export class AxiosRunnerDS extends typeHelperClassDS.GetAxiosRunnerClass() {}

export class QuerchyDS extends typeHelperClassDS.GetQuerchyClass() {}

export class CacherDS extends typeHelperClassDS.GetCacherClass() {}
