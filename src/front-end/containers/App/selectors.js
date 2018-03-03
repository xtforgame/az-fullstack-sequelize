import { createSelector } from 'reselect';
import { capitalizeFirstLetter } from 'common/utils';

import modelMap from './modelMap';

const {
  sessionSelector,
  makeSessionHierarchySelector,
  makeSessionSelectionSelector,
  makeSelectedSessionNodeSelector,
  makeSelectedSessionCollectionSelector,
  makeSelectedSessionSelector,
} = modelMap.selectors;

const makeUserSessionSelector = () => createSelector(
  makeSessionHierarchySelector(),
  (hierarchy) => {
    return hierarchy && hierarchy.byId && hierarchy.byId.me;
  }
);

const makeUserSessionCreateError = () => createSelector(
  makeSessionHierarchySelector(),
  (hierarchy) => {
    return hierarchy && hierarchy.error && hierarchy.error.create;
  }
);

const persistenceSelector = state => state.get('global').persistence;
const makeRememberUserSelector = () => createSelector(
  persistenceSelector,
  (persistence) => persistence.rememberUser
);

export {
  sessionSelector,
  makeSessionHierarchySelector,
  makeSessionSelectionSelector,
  makeSelectedSessionNodeSelector,
  makeSelectedSessionCollectionSelector,
  makeSelectedSessionSelector,
  makeUserSessionCreateError,
  makeUserSessionSelector,
  persistenceSelector,
  makeRememberUserSelector,
};
