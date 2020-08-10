import React from 'react';
import ReactDOM from 'react-dom';
import Routes from 'common/Routes';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(
  <BrowserRouter>
    {renderRoutes(Routes)}
  </BrowserRouter>,
  document.getElementById('page_main'),
);
