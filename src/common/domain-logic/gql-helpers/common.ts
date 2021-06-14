import { Scalars, Maybe } from '../gql-types';

export type GqlResourceBase = {
  id: Scalars['bigint'];
  created_at: Scalars['timestamptz'];
  updated_at: Scalars['timestamptz'];
  deleted_at?: Maybe<Scalars['timestamptz']>;
};

