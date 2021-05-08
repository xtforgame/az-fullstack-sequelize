// ========================================
import fs from 'fs';
import path from 'path';
import appRootPath from 'app-root-path';
import { AzModelManager, JsonSchemasX } from 'az-model-manager';
import { getJsonSchema } from '../../amm-schemas';
import {
  postgresHost as pH,
  postgresPort as pP,
  postgresUser,
  postgresDbName as pD,
  postgresPassword as pPwd,
} from 'config';

const liquidRoot = appRootPath.resolve('./node_modules/az-model-manager/liquids');

const run = async (nodePath, scriptPath, program) => {
  let params = [];
  program
    .version('0.1.0')
    .arguments('<cmd> [params...]')
    .action((cmd, p) => {
      params = p;
    })
    .option('-p, --postgresPort <p>', 'PostgresPort <p>', pP)
    .option('--postgresPassword <pwd>', 'Postgres Password <pwd>', pPwd)
    .option('--postgresDbName <db>', 'postgresDbName <db>', pD)
    .parse(process.argv);

  const [
    postgresHost = pH,
  ] = params;
  const {
    postgresPort,
    postgresPassword,
    postgresDbName,
  } = program.opts();

  const amMgr = new AzModelManager(`postgres://rick:${encodeURI(postgresPassword)}@${postgresHost}:${postgresPort}/${postgresDbName}`);
  const pgStructureDb = await amMgr.getPgStructureDb();
  console.log('pgStructureDb :', pgStructureDb);

  const jsonSchemaX2 = new JsonSchemasX('public', <any>getJsonSchema());
  jsonSchemaX2.parseRawSchemas();
  jsonSchemaX2.toCoreSchemas();
  const compareResult = jsonSchemaX2.compareDb(pgStructureDb);
  console.log('compareResult :', compareResult);
  fs.writeFileSync('compare.json', JSON.stringify({}, null, 2), { encoding: 'utf-8' });
};

export default {
  run,
};

/*
yarn build-server&&yarn c-cmd-dev RemoteSchemaCompare \
    localhost -- \
    --postgresPort 5432 \
    --postgresPassword xxxx1234
*/
