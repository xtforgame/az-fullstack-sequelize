import ServiceBase from '../ServiceBase';
import credentials from './credentials';
import jwtSecrets from './jwtSecrets';
import {
  awsSecrets,
} from 'config';

export default class EnvCfg extends ServiceBase {
  static $name = 'envCfg';

  static $type = 'service';

  constructor() {
    super();
    this.credentials = credentials;
    this.jwtSecrets = jwtSecrets;
    this.awsSecrets = awsSecrets;
  }
}
