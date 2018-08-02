import path from 'path';

const credentialFiles = {
  basePath: path.join(__dirname, '..', 'ssl/production/xxxxxx'),
  key: 'privatekey.pem',
  cert: 'certificate.pem',
};

const jwtSecretFiles = {
  basePath: path.join(__dirname, '..', 'ssl/production/jwt-secret'),
  private: 'privatekey.pem',
  public: 'publickey.pem',
};

const httpPort = 80;
const httpsPort = 443;

const sendRecoveryTokenInterval = 2 * 60 * 1000;
const externalUrl = 'https://localhost:8443';

const postgresPort = 5432;
const postgresUser = 'rick';
const postgresDbName = 'db_rick_data';
const postgresPassword = 'xxxx1234';
const postgresHost = 'localhost';

export {
  credentialFiles,
  jwtSecretFiles,
  httpPort,
  httpsPort,

  sendRecoveryTokenInterval,
  externalUrl,

  postgresPort,
  postgresUser,
  postgresDbName,
  postgresPassword,
  postgresHost,
};
