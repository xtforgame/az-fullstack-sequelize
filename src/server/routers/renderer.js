import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { renderRoutes } from 'react-router-config';
import Routes from 'common/Routes';

export default (ctx) => {
  const content = renderToString(
    <StaticRouter location={ctx.path}>
      <div>{renderRoutes(Routes)}</div>
    </StaticRouter>,
  );
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <!-- The first thing in any HTML file should be the charset -->
        <meta charset="utf-8">
        <!-- Make the page mobile compatible -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="mobile-web-app-capable" content="yes">
        <title>Az-fullstack-sequelize</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
        <style id="insertion-point-jss"></style>
      </head>
      <body>
        <div id="page_main">${content}</div>
        <script src="/assets/js/app.js"></script>
      </body>
    </html>
  `;
};
