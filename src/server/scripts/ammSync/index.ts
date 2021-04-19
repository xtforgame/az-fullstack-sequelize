// ========================================
import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import HasuraManager from '../../hasura';

const liquidRoot = appRootPath.resolve('./node_modules/az-model-manager/liquids');

const run = () => {
  const hsrMgr = new HasuraManager();

  hsrMgr.jsonSchemasX.buildModelTsFile({
    liquidRoot,
  }).then((tsFile) => {
    fs.writeFileSync('src/server/amm-schemas/interfaces.ts', tsFile, { encoding: 'utf-8' });
  });

  const { schemas } = hsrMgr.jsonSchemasX;
  if (schemas.associationModels!['userUserGroup']) {
    fs.writeFileSync('schemas.json', JSON.stringify(schemas, null, 2), { encoding: 'utf-8' });
  }
};

run();
