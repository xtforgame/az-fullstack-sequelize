import path from 'path';

let credentialFiles = {
  basePath: path.join(__dirname, '..', 'ssl/development/self-signed'),
  key: 'privatekey.pem',
  cert: 'certificate.pem',
};

let httpPort = 8080;
let httpsPort = 8443;

let sendRecoveryTokenInterval = 1 * 5 * 1000;
let externalUrl = 'https://localhost:8443';

export {
  credentialFiles,
  httpPort,
  httpsPort,

  sendRecoveryTokenInterval,
  externalUrl,
};
