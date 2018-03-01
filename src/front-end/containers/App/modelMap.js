import { getHeaders } from '~/utils/HeaderManager';
import ModelMap from '~/utils/rest-model/ModelMap';

const modelsDefine = {
  api: {
    url: '/api',
    names: { singular: 'api', plural: 'apis' },
    singleton: true,
    extensionConfigs: {
      epics: {
        getHeaders,
      },
    },
  },
  sessions: {
    url: '/api/sessions',
    names: { singular: 'session', plural: 'sessions' },
    extensionConfigs: {
      epics: {
        getHeaders,
      },
      selectors: {
        baseSelector: state => state.get('global').sessions,
      },
      reducers: {
        getId: action => 'me', // action.data.userid,
      },
    },
  },
  users: {
    url: '/api/users',
    names: { singular: 'user', plural: 'users' },
    extensionConfigs: {
      epics: {
        getHeaders,
      },
      selectors: {
        baseSelector: state => state.get('global').users,
      },
      reducers: {
        getId: action => action.data.id,
      },
    },
  },
};

const modelMap = new ModelMap('global', modelsDefine);
export default modelMap;
