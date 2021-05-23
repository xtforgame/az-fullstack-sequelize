import path from 'path';
import appRootPath from 'app-root-path';
import {
  minioBucketName,
  postgresDbName,
} from './codegen/production';

export { jwtIssuer } from 'common/config';

export {
  externalUrl,
} from './codegen/production';

const appRoot = appRootPath.resolve('./');
const secretsFolder = process.env.AFS_SECRETS_FOLDER || path.join(appRoot, 'secrets');

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

const awsSecrets = {
  basePath: path.join(secretsFolder, 'aws'),
  config: path.join(secretsFolder, 'aws', 'config.json'),
};

const httpPort = 80;
const httpsPort = 443;

const webpackHotClientPort = 18080;

const sendRecoveryTokenInterval = 2 * 60 * 1000;

const mailerConfig = {
  type: 'gmail',
  senderName: '"Az Service" <no-reply@az-authn.io>',
  serviceName: 'Az Service',
  domainName: 'az-authn.io',
  supportEmail: 'support@az-authn.io',
  credentialsFile: path.join(secretsFolder, 'gmail', 'credentials.json'),
  tokenFile: path.join(secretsFolder, 'gmail', 'token.json'),
};

const minioInfoConfig = {
  endPoint: 'minio01',
  port: 9000,
  useSSL: false,
  accessKey: 'minioxxxak',
  secretKey: 'minioxxxsk',
  retry: 10,
  retryInterval: 3000,
  ignoreInitFailure: false,
  defaultBucketName: minioBucketName,
};

const postgresPort = 5432;
const postgresUser = 'rick';
const postgresPassword = 'xxxx1234';
const postgresHost = 'postgres';

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
};
