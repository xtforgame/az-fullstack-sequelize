import React from 'react';
import { Switch, Redirect } from 'react-router';
import EnhancedRoute from 'azrmui/core/routes/EnhancedRoute';
import PrivateRoute from '~/containers/routes/PrivateRoute';

import MainFrame from '~/containers/MainFrame';
import Home from '~/containers/Home';
import LandingMainFrame1 from '~/containers/LandingPage/MainFrame';
import LandingPage from '~/containers/LandingPage/SubContent01';
import EditableLandingPage from '~/containers/EditableLandingPage';
import RstDemo from '~/containers/Home/RstDemo';
import NativeThemeDemo from '~/containers/Home/NativeThemeDemo';
import BigCalendarDemo from '~/containers/Home/BigCalendarDemo';
import EditorJsDemo from '~/containers/Home/EditorJsDemo';
import ImagesInputDemo from '~/containers/Home/ImagesInputDemo';
import GrapesJs from '~/containers/Home/GrapesJs';
import GrapesJsEditor from '~/containers/Home/GrapesJs/Editor';
import GrapesFragmentList from '~/containers/Home/GrapesJs/FragmentList';
import FileManagerDemo from '~/containers/Home/FileManagerDemo';
import FileManagerDemoV2 from '~/containers/Home/FileManagerDemoV2';
import SubContent01 from '~/containers/Home/SubContent01';
import SubContent02 from '~/containers/Home/SubContent02';
import SubContent03 from '~/containers/Home/SubContent03';
import SubContent04 from '~/containers/Home/SubContent04';
import SubContent05 from '~/containers/Home/SubContent05';
import SubContent06 from '~/containers/Home/SubContent06';
import SubContent07 from '~/containers/Home/SubContent07';
import SubContent08 from '~/containers/Home/SubContent08';
import SubContent09 from '~/containers/Home/SubContent09';

import AdminPages from '~/containers/AdminPages';
import OrganizationManagement from '~/containers/AdminPages/OrganizationManagement';
import ProjectManagement from '~/containers/AdminPages/ProjectManagement';
import UserManagementDemo from '~/containers/AdminPages/UserManagementDemo';

import UserProfile from '~/containers/UserProfile';

import Idle from '~/containers/Idle';
import Stats from '~/containers/Idle/tabs/Stats';
import Bots from '~/containers/Idle/tabs/Bots';
import Schedules from '~/containers/Idle/tabs/Schedules';

import Memo from '~/containers/Memo';
import Memos from '~/containers/Memo/tabs/Memos';
import MemoSchedules from '~/containers/Memo/tabs/Schedules';

// import Test from '~/containers/Test';
// import TestContent from '~/containers/Test/TestContent';
// import testCase00 from '~/test-cases/test-case-00';
// import testCase01 from '~/test-cases/test-case-01';

import Login from '~/containers/Login';
import Recovery from '~/containers/Recovery';

import getListHierarchy from '~/containers/MainFrame/getListHierarchy';

// const testCases = [testCase00, testCase01];
// const getTestCaseRoutes = () => testCases.map((testCase, i) => {
//   const ii = ('0'.repeat(3) + i).slice(-3);
//   return {
//     name: `case${ii}`,
//     path: `/test/case${ii}`,
//     component: props => (<TestContent testCase={testCase} />),
//     navbar: {
//       title: `Case ${ii}`,
//     },
//   };
// });

const defaultName = 'default';

const globalRouteConfig = {
  name: 'root',
  component: ({ routeView }) => routeView, // or props => props.routeViews.default
  routeViews: [{
    switch: true,
    name: defaultName,
    routes: [{
      name: 'redirect',
      path: '/',
      component: () => <Redirect to={{ pathname: '/home' }} />,
      exact: true,
    },
    {
      name: 'landing-main1',
      path: '/landing1',
      component: LandingMainFrame1,
      routeViews: [{
        switch: true,
        name: defaultName,
        routes: [{
          name: 'landing1',
          path: '/landing1',
          component: LandingPage,
        }],
      }],
    },
    {
      name: 'landing-main2',
      path: '/landing2',
      component: EditableLandingPage,
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
    },
    {
      name: 'recovery',
      path: '/recovery/:username/:code?',
      component: Recovery,
    },
    {
      name: 'main',
      path: '/',
      routeClass: PrivateRoute,
      component: MainFrame,
      routeViews: [{
        switch: true,
        name: defaultName,
        routes: [{
          name: 'home',
          path: '/home',
          component: Home,
          // navbar: {
          //   title: 'Home',
          //   level: 0,
          //   // level: currentLevel => (currentLevel ? (currentLevel - 1) : 0),
          // },
          navbar: true,
          // navbar: {
          //   title: 'Home',
          // },
          routeViews: [{
            routes: [{
              name: 'home-index',
              path: '/home',
              component: () => <Redirect to={{ pathname: '/home/sub01' }} />,
              exact: true,
            },
            {
              name: 'rst',
              path: '/home/rst-demo',
              component: RstDemo,
              navbar: {
                title: 'RstDemo',
              },
            },
            {
              name: 'native-theme',
              path: '/home/native-theme',
              component: NativeThemeDemo,
              navbar: {
                title: 'NativeThemeDemo',
              },
            },
            {
              name: 'big-calendar',
              path: '/home/big-calendar',
              component: BigCalendarDemo,
              navbar: {
                title: 'BigCalendarDemo',
              },
            },
            {
              name: 'editor-js',
              path: '/home/editor-js',
              component: EditorJsDemo,
              navbar: {
                title: 'EditorJsDemo',
              },
            },
            {
              name: 'images-input',
              path: '/home/images-input',
              component: ImagesInputDemo,
              navbar: {
                title: 'ImagesInputDemo',
              },
            },
            {
              name: 'grapesjs',
              path: '/home/grapesjs',
              component: GrapesJs,
              navbar: {
                title: 'GrapesJs',
              },
              routeViews: [{
                routes: [
                  {
                    name: 'grapesjs-fragment-list',
                    path: '/home/grapesjs',
                    component: GrapesFragmentList,
                    navbar: {
                      title: 'Grapes Fragment List',
                    },
                    exact: true,
                  },
                  {
                    name: 'grapesjs-editor',
                    path: '/home/grapesjs/:pType/:pId/*',
                    component: GrapesJsEditor,
                    navbar: {
                      title: 'Editor',
                    },
                  },
                ],
              }],
            },
            {
              name: 'file-manager-demo',
              path: '/home/file-manager-demo',
              component: FileManagerDemo,
              navbar: {
                title: 'FileManagerDemo',
              },
            },
            {
              name: 'file-manager-demo-v2',
              path: '/home/file-manager-demo-v2',
              component: FileManagerDemoV2,
              navbar: {
                title: 'FileManagerDemoV2',
              },
            },
            {
              name: 'sub01',
              path: '/home/sub01',
              component: SubContent01,
              navbar: {
                title: 'Sub 01',
              },
            },
            {
              name: 'sub02',
              path: '/home/sub02',
              component: SubContent02,
              navbar: {
                title: 'Sub 02',
              },
            },
            {
              name: 'sub03',
              path: '/home/sub03',
              component: SubContent03,
              navbar: {
                title: 'Sub 03',
              },
            },
            {
              name: 'sub04',
              path: '/home/sub04',
              component: SubContent04,
              navbar: {
                title: 'Sub 04',
              },
            },
            {
              name: 'sub05',
              path: '/home/sub05',
              component: SubContent05,
              navbar: {
                title: 'Sub 05',
              },
            },
            {
              name: 'sub06',
              path: '/home/sub06',
              component: SubContent06,
              navbar: {
                title: 'Sub 06',
              },
            },
            {
              name: 'sub07',
              path: '/home/sub07',
              component: SubContent07,
              navbar: {
                title: 'Sub 07',
              },
            },
            {
              name: 'sub08',
              path: '/home/sub08',
              component: SubContent08,
              navbar: {
                title: 'Sub 08',
              },
            },
            {
              name: 'sub09',
              path: '/home/sub09',
              component: SubContent09,
              navbar: {
                title: 'Sub 09',
              },
            }],
          }],
        },
        {
          name: 'management',
          path: '/management',
          component: AdminPages,
          // navbar: {
          //   title: 'AdminPages',
          //   level: 0,
          //   // level: currentLevel => (currentLevel ? (currentLevel - 1) : 0),
          // },
          // navbar: true,
          navbar: {
            title: '管理頁面',
          },
          routeViews: [{
            routes: [{
              name: 'management-index',
              path: '/management',
              component: () => <Redirect to={{ pathname: '/management/organization' }} />,
              exact: true,
            },
            {
              name: 'organization',
              path: '/management/organization',
              component: OrganizationManagement,
              navbar: {
                title: '組織管理',
              },
            },
            {
              name: 'project',
              path: '/management/project',
              component: ProjectManagement,
              navbar: {
                title: '專案管理',
              },
            },
            {
              name: 'user',
              path: '/management/user',
              component: UserManagementDemo,
              navbar: {
                title: '使用者管理(範例)',
              },
            }],
          }],
        },
        {
          name: 'idle',
          path: '/idle',
          component: Idle,
          navbar: true,
          routeViews: [{
            routes: [{
              name: 'idle-index',
              path: '/idle',
              component: () => <Redirect to={{ pathname: '/idle/stats' }} />,
              exact: true,
            },
            {
              name: 'stats',
              path: '/idle/stats',
              component: Stats,
              navbar: {
                title: 'Stats',
              },
            },
            {
              name: 'bots',
              path: '/idle/bots',
              component: Bots,
              navbar: {
                title: 'Bots',
              },
            },
            {
              name: 'schedules',
              path: '/idle/schedules',
              component: Schedules,
              navbar: {
                title: 'Schedules',
              },
            }],
          }],
        },
        {
          name: 'memo',
          path: '/memo',
          component: Memo,
          navbar: true,
          routeViews: [{
            routes: [{
              name: 'memo-index',
              path: '/memo',
              component: () => <Redirect to={{ pathname: '/memo/memos' }} />,
              exact: true,
            },
            {
              name: 'memos',
              path: '/memo/memos',
              component: Memos,
              navbar: {
                title: 'Stats',
              },
            },
            {
              name: 'schedules',
              path: '/memo/schedules',
              component: MemoSchedules,
              navbar: {
                title: 'Schedules',
              },
            }],
          }],
        },
        // {
        //   name: 'test',
        //   path: '/test',
        //   component: Test,
        //   navbar: true,
        //   routeViews: [{
        //     routes: [{
        //       name: 'test-index',
        //       path: '/test',
        //       component: () => <Redirect to={{ pathname: '/test/case001' }} />,
        //       exact: true,
        //     },
        //     ...getTestCaseRoutes(),
        //     ],
        //   }],
        // },
        {
          name: 'user-profile',
          path: '/user-profile',
          component: UserProfile,
        }],
      }],
    }],
  }],
};

getListHierarchy(globalRouteConfig);

function createRouteViews(routeViewsConfigs) {
  const result = {};
  routeViewsConfigs.forEach((v) => {
    const isSwitch = v.switch;
    const name = v.name || defaultName;

    result[name] = v.routes.map(routeConfig => createRoute(routeConfig));

    if (isSwitch) {
      result[name] = (
        <Switch>
          {result[name]}
        </Switch>
      );
    }
  });
  return result;
}

function createRoute(routeConfig) {
  const {
    name,
    routeClass,
    routeViews: routeViewsConfigs,
    ...rest
  } = routeConfig;

  const CustomRoute = routeClass || EnhancedRoute;
  const routeViews = (routeViewsConfigs && createRouteViews(routeViewsConfigs)) || {};
  const routeView = routeViews[defaultName];
  return (
    <CustomRoute
      // do not provide key; this is a bug(?) of react-router v4
      key={name}
      {...rest}
      routeName={name}
      routeView={routeView}
      routeViews={routeViews}
    />
  );
}

export default () => createRoute(globalRouteConfig);
