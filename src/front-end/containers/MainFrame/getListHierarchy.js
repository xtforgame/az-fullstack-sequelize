import { capitalizeFirstLetter } from 'common/utils';

let listHierarchy = null;

export default (routesConfig) => {
  if (listHierarchy) {
    return listHierarchy;
  }

  listHierarchy = [];

  const toListDefine = (routeConfig, currentList = listHierarchy, level = 0, parents = []) => {
    let {
      routeViews,
      name,
      path,
      navbar,
    } = routeConfig;

    let listData = null;
    let newLevel = level;
    let newParents = parents;
    let newList = currentList;

    if (navbar) {
      if (navbar === true) {
        navbar = {};
      }
      const title = navbar.title || capitalizeFirstLetter(name);
      listData = {
        name,
        path,
        title,
        routeConfig,
        level,
        parents,
        navbar,
      };
      newLevel = level + 1;
      newParents = parents.concat([listData]);
      currentList.push(listData);
    }

    if (routeViews) {
      if (listData) {
        listData.children = [];
        newList = listData.children;
      }

      routeViews.forEach((routeView) => {
        routeView.routes.forEach((route) => {
          toListDefine(route, newList, newLevel, newParents);
        });
      });
    }
  };

  toListDefine(routesConfig);

  return listHierarchy;
};
