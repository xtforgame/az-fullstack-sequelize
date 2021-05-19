const { promiseReduce } = require('./utils');

module.exports = async ({ prompter, args }, { localConfig, config, step }) => {
  const choices = []
  const server = localConfig.server || {};
  const project = config.project || {};
  if (!server.externalUrl) {
    choices.push({
      name: 'externalUrl',
      message: 'External Url',
      initial: args.externalUrl || 'https://localhost:8443',
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid External Url';
          return false;
        }
        // let urlValidator = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        // if (!value.match(urlValidator)) {
        //   this.error = 'Invalid External Url';
        //   return false;
        // }
        this.error = void 0;
        return true;
      },
    });
  }
  if (!server.minioBucketName) {
    choices.push({
      name: 'minioBucketName',
      message: 'Minio Bucket Name',
      initial: args.minioBucketName || project.dashedName,
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid Minio Bucket Name';
          return false;
        }
        // let urlValidator = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        // if (!value.match(urlValidator)) {
        //   this.error = 'Invalid External Url';
        //   return false;
        // }
        this.error = void 0;
        return true;
      },
    });
  }
  if (!server.postgresDbName) {
    choices.push({
      name: 'postgresDbName',
      message: 'postgres Db Name',
      initial: args.postgresDbName || `db_${project.underscoredName}`,
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid Postgres Db Name';
          return false;
        }
        // let urlValidator = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        // if (!value.match(urlValidator)) {
        //   this.error = 'Invalid External Url';
        //   return false;
        // }
        this.error = void 0;
        return true;
      },
    });
  }
  if (choices.length === 0) {
    return {
      server,
    }
  }
  return {
    server: {
      ...server,
      ...(await prompter.prompt({
        type: 'editable',
        name: 'server',
        message: `${step}. Server Config:`,
        choices,
      })).server,
    },
  };
}
