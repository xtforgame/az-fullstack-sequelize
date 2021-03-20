/* eslint-disable no-param-reassign, no-console */
// import Sequelize from 'sequelize';
import path from 'path';
import {
  // RestfulResponse,
  RestfulError,
} from 'az-restful-helpers';
// import fs from 'fs';
import multer from 'koa-multer';
import RouterBase from '../core/router-base';

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

export default class FilePathRouterBase extends RouterBase {
  checkPermissionV1 = (router, apiPath, options = {}) => async (ctx, next) => {
    const n = async () => {
      // if (!ctx.local.userSession
      //   || !ctx.local.userSession.user_id
      //   || ctx.local.userSession.user_id !== ctx.params.userId
      // ) {
      //   return RestfulError.koaThrowWith(ctx, 403, 'Forbidden');
      // }
      const filename = ctx.path.replace(`/api/p/${apiPath}/`, '');
      // console.log('filename :', filename);
      ctx.local.objectPath = decodeURI(`user-home/${filename}`);
      return next();
    };
    return this.authKit.koaHelperEx.getIdentity(ctx, n);
  }

  setRoutesV1(router, options = {}) {
    const subfolder = options.subfolder || 'files';
    router.options(`/api/p/files/:userId/${subfolder}/*`, this.checkPermissionV1(router, 'files', options), (ctx, next) => this.minioApi.statFile(ctx.local.objectPath)
      .then(({ headers }) => {
        ctx.set(headers);
        ctx.body = headers;
      })
      .catch(() => {
        ctx.body = {};
      }));
    router.get(`/api/p/files/:userId/${subfolder}/*`, this.checkPermissionV1(router, 'files', options), (ctx, next) => this.minioApi.getFile(ctx.local.objectPath)
      .then(({ dataStream, headers }) => {
        ctx.set(headers);
        ctx.body = dataStream;
      })
      .catch(() => RestfulError.koaThrowWith(ctx, 404, 'Not Found')));

    router.post(`/api/p/files/:userId/${subfolder}`, mdUpload, this.checkPermissionV1(router, 'files', options), async (ctx, next) => {
      // ctx.params.filename
      const files = (ctx.req.files && ctx.req.files.file) || [];
      // console.log('files :', files);
      // console.log('ctx.req.body :', ctx.req.body);
      const file = files[0];
      if (!file) {
        return RestfulError.koaThrowWith(ctx, 400, 'Bad Request');
      }
      const filename = ctx.req.body.filename || file.originalname;
      if (!filename) {
        return RestfulError.koaThrowWith(ctx, 400, 'Bad Request');
      }

      console.log('ctx.local.objectPath :', ctx.local.objectPath);
      const fullPath = path.join(ctx.local.objectPath, filename);
      console.log('fullPath :', fullPath);
      if (!fullPath.startsWith(`user-home/${ctx.params.userId}/${subfolder}/`)) {
        return RestfulError.koaThrowWith(ctx, 400, 'Bad Request');
      }

      // console.log('metadata :', metadata);
      console.log('file.mimetype, file.encoding, file.originalname :', file.mimetype, file.encoding, file.originalname);
      const result = await this.minioApi.simpleSaveFile(fullPath, {
        creatorIp: ctx.request.ip,
        userId: ctx.params.userId,
        encoding: file.encoding,
        contentType: file.mimetype,
        buffer: file.buffer,
        originalName: file.originalname,
      });
      return ctx.body = {
        ...result,
        success: 1,
        file: {
          url: result.filename.replace('user-home', 'api/p/files'),
        },
      };
    });

    const handleListFile = async (ctx, next) => {
      let p = (ctx.request.body && ctx.request.body.path) || ctx.path.replace(`/api/p/file-list/${ctx.params.userId}/${subfolder}`, '');

      const prefix = `user-home/${ctx.params.userId}/${subfolder}`;
      if (p.length && p.substr(0, 1) === '/') {
        p = p.substr(1, p.length - 1);
      }
      let fullPath = path.join(prefix, p);
      // console.log('p, fullPath :', p, fullPath);
      if (fullPath !== prefix && !fullPath.startsWith(`${prefix}/`)) {
        return RestfulError.koaThrowWith(ctx, 400, 'Bad Request');
      }
      if (fullPath.substr(fullPath.length - 1, 1) !== '/') {
        fullPath = `${fullPath}/`;
      }

      const list = await this.minioApi.listObjects(fullPath);
      // console.log('list :', list);
      return ctx.body = list.map((objectInfo) => {
        const oi = { ...objectInfo };
        if (oi.name) {
          oi.name = oi.name.replace(`${fullPath}`, '');
        }
        if (oi.prefix) {
          oi.prefix = oi.prefix.replace(`${fullPath}`, '');
        }
        return oi;
      });
    };

    router.get(`/api/p/file-list/:userId/${subfolder}`, this.checkPermissionV1(router, 'file-list', options), handleListFile);
    router.get(`/api/p/file-list/:userId/${subfolder}/*`, this.checkPermissionV1(router, 'file-list', options), handleListFile);
    router.post(`/api/p/file-list/:userId/${subfolder}`, this.checkPermissionV1(router, 'file-list', options), handleListFile);
    router.post(`/api/p/file-list/:userId/${subfolder}/*`, this.checkPermissionV1(router, 'file-list', options), handleListFile);
  }
}
