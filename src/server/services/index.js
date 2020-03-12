import EnvCfg from '~/services/env-cfg';
import HttpApp from '~/services/http-app';
import RouterManager from '~/services/router-manager';
import Mailer from '~/services/mailer';
import MinioApi from '~/services/minio';
import SequelizeDb from '~/services/sequelize-db';
import ResourceManager from '~/services/resource-manager';
import CreateTestData from '~/services/create-test-data';

export default [
  EnvCfg,
  HttpApp,
  RouterManager,
  Mailer,
  MinioApi,
  SequelizeDb,
  ResourceManager,
  CreateTestData,
];
