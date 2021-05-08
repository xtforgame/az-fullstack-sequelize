---
to: src/server/configs/codegen/development.js
---
const externalUrl = 'https://localhost:8443';
const minioBucketName = '<%= server.minioBucketName %>';
const postgresDbName = '<%= server.postgresDbName %>';

export {
  externalUrl,
  minioBucketName,
  postgresDbName,
};
