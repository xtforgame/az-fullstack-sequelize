/* eslint-disable no-param-reassign, no-console */
// import Sequelize from 'sequelize';
import axios from 'axios';
import path from 'path';
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
// import fs from 'fs';
import multer from 'koa-multer';
import { linkPreview } from 'link-preview-node';
import FilePathRouterBase from './FilePathRouterBase';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fieldNameSize: 100, // default 100 bytes
    fieldSize: 1000, // default 1MB
    fields: 5000, // default Infinity
    fileSize: 50000000, // Infinity (in bytes)
    files: 500, // Infinity (in bytes)
    parts: 500, // (fields + files) Infinity
    headerPairs: 2000, // Default: 2000
  },
});

/*
curl \
  -F 'entry=src' \
  -F 'file=@test-files/src.zip' \
  http://localhost:8080/api/files

curl \
  -F 'entry=src' \
  -F 'file=@dev.yml' \
  -F 'file=@docker-compose.yml' \
  -F 'file=@gulpfile.js' \
  http://localhost:8080/api/files
*/

const mdUpload = upload.fields([{ name: 'file', maxCount: 10 }, { name: 'metadata', maxCount: 10 }]);

export default class NopgRouter extends FilePathRouterBase {
  setupRoutes({ router }) {
    if (!this.minioApi) {
      return;
    }
    router.options('/api/p/fragments/:userId/np-fragments/*', this.checkPermissionV1(router, 'fragments', {}), (ctx, next) => this.minioApi.statFile(ctx.local.objectPath)
      .then(({ headers }) => {
        ctx.set(headers);
        ctx.body = headers;
      })
      .catch(() => {
        ctx.body = {};
      }));
    router.get('/api/p/fragments/:userId/np-fragments/*', this.checkPermissionV1(router, 'fragments', {}), (ctx, next) => this.minioApi.getFile(ctx.local.objectPath)
      .then(async ({ dataStream, headers }) => {
        ctx.set(headers);

        const r = await new Promise((res, rej) => {
          const bufs = [];
          dataStream.on('data', (b) => { bufs.push(b); });
          dataStream.on('error', rej);
          dataStream.on('end', () => res(Buffer.concat(bufs)));
        });
        const json = JSON.parse(r.toString('utf8'));

        ctx.set({
          'Content-Type': 'text/html; charset=UTF-8',
        });
        // console.log('json :', json);
        const htmlBody = json.grapesjsData['gjs-html'];
        const css = json.grapesjsData['gjs-css'];
        ctx.body = `
        <html>
          <head>
            <script type="text/javascript" src="/grapesjs/canvi-master/canvi.js"></script>
            <link href="/css/grapesjs-canvas.css" rel="stylesheet">
            <link href="/css/style.css" rel="stylesheet">
            <link href="/grapesjs/canvi-master/canvi.css" rel="stylesheet">
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${htmlBody}
          </body>
        </html>
        `;
      })
      .catch(() => RestfulError.koaThrowWith(ctx, 404, 'Not Found')));
  }
}
