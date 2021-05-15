/* eslint-disable no-unused-vars, no-undef, prefer-promise-reject-errors, consistent-return */

import chai from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import Server from 'server';
import ResourceManager from 'server/services/resource-manager';
import { UserI } from 'server/amm-schemas/interfaces';
import HasuraManager from 'server/hasura';
import {
  runningMode,
} from 'common-config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

declare const describe;
declare const beforeEach;
declare const afterEach;
declare const it;

const { expect } = chai;

describe('Server Test Cases', () => {
  describe('Mode', () => {
    it('should be in test mode', (done) => {
      expect(runningMode).to.equal('Test');
      done();
    });
  });

  describe('Sync', function () {
    this.timeout(3000000);
    let server : Server | null = null;
    const stubs : any[] = [];
    beforeEach(() => {
      server = new Server();
      return server.start();
    });

    afterEach(() => {
      stubs.forEach(stub => stub.restore());
      return server!.destroy()
      .then(() => {
        server = null;
      });
    });

    it('should be get tables', async () => {
      const hsrMgr = new HasuraManager();
      const rm: ResourceManager = server?.ioc.get('resourceManager');
      const { resourceManager } = rm;

      const { data } = await axios({
        url: `http://localhost:8082/v1/metadata`,
        method: 'post',
        headers: {
          'X-Hasura-Role': 'admin',
          'X-Hasura-Admin-Secret': 'xxxxhsr',
          'Content-Type': 'application/json',
        },
        data: {
          type: 'pg_add_source',
          args: {
            name: 'db_studiodoe',
            configuration: {
              connection_info: {
                database_url: 'postgres://postgres:xxxx1234@pg-src:5432/db_studiodoe',
                pool_settings: {
                  max_connections: 50,
                  idle_timeout: 180,
                  retries: 1,
                },
              },
            },
          },
        },
      });
      return hsrMgr.test();
    });
  });
});
