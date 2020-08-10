import App from './App';

const Content = () => 'Content';
const NotFound = () => 'NotFound';

export default [{
  component: App,
  routes: [
    {
      component: Content,
      path: '/',
      exact: true,
    }, {
      component: Content,
      path: '/ssr/',
      exact: true,
    }, {
      component: NotFound,
    },
  ],
}];
