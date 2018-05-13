import { createSelector } from 'reselect';
import { capitalizeFirstLetter } from 'common/utils';
import { defaultUiTheme } from '~/styles/getPageContext';

import modelMap from './modelMap';

const {
  sessionSelector,
  makeSessionHierarchySelector,
  makeSessionSelectionSelector,
  makeSelectedSessionNodeSelector,
  makeSelectedSessionCollectionSelector,
  makeSelectedSessionSelector,

  userSelector,
  makeUserHierarchySelector,
  makeUserSelectionSelector,
  makeSelectedUserNodeSelector,
  makeSelectedUserCollectionSelector,
  makeSelectedUserSelector,
} = modelMap.selectors;

const makeUserSessionSelector = () => createSelector(
  makeSessionHierarchySelector(),
  (hierarchy) => {
    return hierarchy && hierarchy.byId && hierarchy.byId.me;
  }
);

const makeMyUserSelector = () => createSelector(
  makeUserSessionSelector(),
  makeUserHierarchySelector(),
  (mySession, userHierarchy) => {
    if(!mySession
      || !userHierarchy
      || (mySession.user_id === undefined)
      || !userHierarchy.byId
    ){
      return undefined;
    }
    return userHierarchy.byId[mySession.user_id];
  }
);

const persistenceSelector = state => state.get('global').persistence;
const makeRememberUserSelector = () => createSelector(
  persistenceSelector,
  (persistence) => persistence.rememberUser
);

const makeUiThemeSelector = () => createSelector(
  persistenceSelector,
  (persistence) => persistence.uiTheme || defaultUiTheme,
);

export {
  sessionSelector,
  makeSessionHierarchySelector,
  makeSessionSelectionSelector,
  makeSelectedSessionNodeSelector,
  makeSelectedSessionCollectionSelector,
  makeSelectedSessionSelector,

  userSelector,
  makeUserHierarchySelector,
  makeUserSelectionSelector,
  makeSelectedUserNodeSelector,
  makeSelectedUserCollectionSelector,
  makeSelectedUserSelector,

  makeUserSessionSelector,
  makeMyUserSelector,
  persistenceSelector,
  makeRememberUserSelector,
  makeUiThemeSelector,
};
