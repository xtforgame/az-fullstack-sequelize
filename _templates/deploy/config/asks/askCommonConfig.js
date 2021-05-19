const { promiseReduce } = require('./utils');

module.exports = async ({ prompter, args }, { localConfig, config, step }) => {
  const choices = []
  const common = localConfig.common || {};
  const project = config.project || {};
  if (!common.jwtIssuer) {
    choices.push({
      name: 'jwtIssuer',
      message: 'JWT Issuer',
      initial: args.jwtIssuer || project.dashedName || '',
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid JWT Issuer';
          return false;
        }
        this.error = void 0;
        return true;
      },
    });
  }
  if (choices.length === 0) {
    return {
      common,
    }
  }
  return {
    common: {
      ...common,
      ...(await prompter.prompt({
        type: 'editable',
        name: 'common',
        message: `${step}. Common Config:`,
        choices,
      })).common,
    },
  };
}
