import path from 'path';

const credentialFiles = {
  basePath: path.join(__dirname, '..', 'ssl/development/self-signed'),
  key: 'privatekey.pem',
  cert: 'certificate.pem',
};

const httpPort = 8080;
const httpsPort = 8443;

const sendRecoveryTokenInterval = 1 * 5 * 1000;
const externalUrl = 'https://localhost:8443';

const postgresPort = 5432;
const postgresUser = 'rick';
const postgresDbName = 'db_rick_data';
const postgresPassword = 'xxxx1234';
const postgresHost = 'localhost';

export {
  credentialFiles,
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
