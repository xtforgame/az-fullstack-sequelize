/* eslint-disable no-unused-vars, no-undef, prefer-promise-reject-errors, consistent-return */

import chai from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import Server from 'server';
import HasuraManager from 'server/hasura';
import {
  runningMode,
} from 'common-config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { expect } = chai;

describe('Server Test Cases', () => {
  describe('Mode', () => {
    it('should be in test mode', (done) => {
      expect(runningMode).to.equal('Test');
      done();
    });
  });

  describe('Sync', function () {
    this.timeout(30000);
    let server = null;
    const stubs = [];
    beforeEach(() => {
      const originalFunc = Server.prototype.start;
      const stub = sinon.stub(Server.prototype, 'start')
      .callsFake(function (...args) {
        // console.log('callsFake');
        return originalFunc.apply(this, ...args);
      });
      stubs.push(stub);
      server = new Server();
      return server.start();
    });

    afterEach(() => {
      stubs.forEach(stub => stub.restore());
      return server.destroy()
      .then(() => {
        server = null;
      });
    });

    it('should be get tables', async () => {
      const hsrMgr = new HasuraManager();
      return hsrMgr.test();
    });
  });
});
