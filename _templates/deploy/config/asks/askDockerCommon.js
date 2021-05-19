const { promiseReduce } = require('./utils');

module.exports = async ({ prompter, args }, { localConfig, step }) => {
  const choices = []
  const docker = localConfig.docker || {};
  if (!docker.envVarPrfix) {
    choices.push({
      name: 'envVarPrfix',
      message: 'Env Var Prfix',
      initial: args.envVarPrfix || 'az',
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid Env Var Prfix';
          return false;
        }
        let letters = /^[A-Za-z]{1}[A-Za-z0-9]*$/;
        if (!value.match(letters)) {
          this.error = 'Invalid Env Var Prfix';
          return false;
        }
        this.error = void 0;
        return true;
      },
    });
  }
  if (!('networkName' in docker)) {
    choices.push({
      name: 'networkName',
      message: 'Network Name',
      initial: args.networkName || 'mainginx_net',
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = void 0;
          return true;
        }
        let letters = /^[A-Za-z]{1}[A-Za-z_0-9]*$/;
        if (!value.match(letters)) {
          this.error = 'Invalid Network Name';
          return false;
        }
        this.error = void 0;
        return true;
      },
    });
  }
  if (choices.length === 0) {
    return {
      docker,
    }
  }
  return {
    docker: {
      ...docker,
      ...(await prompter.prompt({
        type: 'editable',
        name: 'docker',
        message: `${step}. Docker Common:`,
        choices,
      })).docker,
    },
  };
}
