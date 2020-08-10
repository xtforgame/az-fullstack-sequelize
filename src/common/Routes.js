import App from './App';

const Content = () => 'Content';
const Article = ({ match }) => {
  return match.params.articleId;
};
const NotFound = () => 'NotFound';

export default [{
  component: App,
  routes: [
    {
      component: Content,
      path: '/',
      exact: true,
    }, {
      component: Article,
      path: '/ssr/articles/:articleId',
    }, {
      component: NotFound,
    },
  ],
}];
