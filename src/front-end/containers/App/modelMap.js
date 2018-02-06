import ModelMap from '~/utils/rest-model/ModelMap';

const modelsDefine = {
  api: {
    url: '/api',
    names: { singular: 'api', plural: 'apis' },
    singleton: true,
    extensionConfigs: {},
  },
  sessions: {
    url: '/api/sessions',
    names: { singular: 'session', plural: 'sessions' },
    extensionConfigs: {
      selectors: {
        baseSelector: state => state.get('global').sessions,
      },
      reducers: {
        getId: action => 'me', // action.data.userid,
      },
    },
  },
};

const modelMap = new ModelMap('global', modelsDefine);
export default modelMap;
