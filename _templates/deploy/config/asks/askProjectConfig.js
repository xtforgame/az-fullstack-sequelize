const { promiseReduce } = require('./utils');

// {
//   name: 'name',
//   message: 'Project Name',
//   initial: (config.project && config.project.name),
//   editable: true,
//   validate(value, state) {
//     // console.log('state :', state);
//     if (!value) {
//       this.error = 'Invalid Project Name';
//       return false;
//     }
//     this.error = void 0;
//     return true;
//   },
// },

module.exports = async ({ prompter, args }, { localConfig, config, step }) => {
  const choices1 = [];
  const project =  {
    ...localConfig.project,
    ...config.project,
  };
  if (!project.name || 
    !project.camelName || 
    !project.dashedName || 
    !project.underscoredName || 
    !project.safename
  ) {
    choices1.push({
      name: 'name',
      message: 'Project Name',
      initial: (config.project && config.project.name),
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid Project Name';
          return false;
        }
        let letters = /^[A-Za-z]{1}[A-Za-z0-9-_\s]*$/;
        if (!value.match(letters)) {
          this.error = 'Invalid Project Name';
          return false;
        }
        this.error = void 0;
        return true;
      },
    });
  }
  const lowerTheFirstLetter = str => (str.charAt(0).toLowerCase() + str.slice(1));

  let result = {};
  if (choices1.length === 0) {
    result.name = project.name;
  } else {
    result.name = (await prompter.prompt({
      type: 'editable',
      name: 'project',
      message: `${step}-1. Project Config:`,
      choices: choices1,
    })).project.name;
  }

  const choices2 = [];
  if (!project.displayName) {
    choices2.push({
      name: 'displayName',
      message: 'Project Display Name',
      initial: (config.project && (config.project.displayName || config.project.name)),
      editable: true,
      validate(value, state) {
        // console.log('state :', state);
        if (!value) {
          this.error = 'Invalid Project Display Name';
          return false;
        }
        let letters = /^[A-Za-z]{1}[A-Za-z0-9-_\s]*$/;
        if (!value.match(letters)) {
          this.error = 'Invalid Project Display Name';
          return false;
        }
        this.error = void 0;
        return true;
      },
    });
  }

  if (choices2.length === 0) {
    result.displayName = project.displayName;
  } else {
    result.displayName = (await prompter.prompt({
      type: 'editable',
      name: 'project',
      message: `${step}-2. Project Config:`,
      choices: choices2,
    })).project.displayName;
  }

  result.camelName = lowerTheFirstLetter(result.name.replace(/[_\s-]+([a-zA-Z])/g, g => g[g.length - 1].toUpperCase()));
  result.dashedName = result.camelName.replace(/([A-Z])/g, g => `-${g.toLowerCase()}`);
  result.underscoredName = result.camelName.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`);
  result.safename = result.dashedName.replace(/-/g, '').toLowerCase();

  return {
    project: {
      ...project,
      ...result,
    },
  };
}
