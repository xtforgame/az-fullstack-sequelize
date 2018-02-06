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

export {
  sessionSelector,
  makeSessionHierarchySelector,
  makeSessionSelectionSelector,
  makeSelectedSessionNodeSelector,
  makeSelectedSessionCollectionSelector,
  makeSelectedSessionSelector,
  makeUserSessionSelector,
};
