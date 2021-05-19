/* eslint-disable no-console, import/no-extraneous-dependencies */
import appRootPath from 'app-root-path';
import path from 'path';
import ServiceBase from '../ServiceBase';
import AwsManager from './AwsManager';

const appRoot = appRootPath.resolve('./');

export default class AwsSdk extends ServiceBase {
  static $name = 'awsSdk';

  static $type = 'service';

  static $inject = ['envCfg'];

  awsMgr: AwsManager;

  constructor(envCfg) {
    super();
    this.awsMgr = new AwsManager({ loadFromPath: envCfg.awsSecrets.config });
  }

  async onStart() {
  }

  onDestroy() {
  }
}
