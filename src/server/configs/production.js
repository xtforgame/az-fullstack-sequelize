import path from 'path';

let credentialFiles = {
  basePath: path.join(__dirname, '..', 'ssl/production/xxxxxx'),
  key: 'privatekey.pem',
  cert: 'certificate.pem',
};

let jwtSecretFiles = {
  basePath: path.join(__dirname, '..', 'ssl/production/jwt-secret'),
  private: 'privatekey.pem',
  public: 'publickey.pem',
};

let httpPort = 80;
let httpsPort = 443;

let postgresPort = 5432;
let postgresUser = 'rick';
let postgresDbName = 'db_rick_data';
let postgresPassword = 'xxxx1234';
let postgresHost = 'localhost';

export {
  credentialFiles,
  jwtSecretFiles,
  httpPort,
  httpsPort,

  postgresPort,
  postgresUser,
  postgresDbName,
  postgresPassword,
  postgresHost,
};
