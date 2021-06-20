import path from 'path';
import appRootPath from 'app-root-path';
import {
  minioBucketName,
  postgresDbName,
} from './codegen/test';

export { jwtIssuer } from 'common/config';

export {
  externalUrl,
} from './codegen/test';

const appRoot = appRootPath.resolve('./');
const secretsFolder = path.join(appRoot, 'dev-secrets');

const credentialFiles = {
  basePath: path.join(secretsFolder, 'ssl'),
  key: 'privatekey.pem',
  cert: 'certificate.pem',
};

const jwtSecretFiles = {
  basePath: path.join(secretsFolder, 'jwt'),
  private: 'jwtRS256.key',
  public: 'jwtRS256.key.pub',
};

const secretsFolderForAws = path.join(appRoot, 'secrets');
const awsSecrets = {
  basePath: path.join(secretsFolderForAws, 'aws'),
  config: path.join(secretsFolderForAws, 'aws', 'config.json'),
};

const httpPort = 8080;
const httpsPort = 8443;

const webpackHotClientPort = 18080;

const sendRecoveryTokenInterval = 1 * 20 * 1000;

const mailerConfig = {
  type: 'ethereal',
  serviceName: 'Az Service',
  domainName: 'az-authn.io',
  supportEmail: 'support@az-authn.io',
  senderName: '"Az Service" <no-reply@az-authn.io>',
};

const minioInfoConfig = {
  endPoint: 'localhost',
  port: 9001,
  useSSL: false,
  accessKey: 'minioxxxak',
  secretKey: 'minioxxxsk',
  retry: 10,
  retryInterval: 3000,
  ignoreInitFailure: true,
  defaultBucketName: minioBucketName,
};

const postgresPort = 5432;
const postgresUser = 'rick';
const postgresPassword = 'xxxx1234';
const postgresHost = 'localhost';

const hasuraAdminSecret = 'xxxxhsr';

export {
  credentialFiles,
  jwtSecretFiles,
  awsSecrets,
  httpPort,
  httpsPort,

  webpackHotClientPort,

  sendRecoveryTokenInterval,

  mailerConfig,

  minioInfoConfig,

  postgresPort,
  postgresUser,
  postgresDbName,
  postgresPassword,
  postgresHost,

  hasuraAdminSecret,
};
