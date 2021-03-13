const { capitalizeFirstLetter } = require('./utils');

module.exports = (serviceName, defaultExposePort = null) => async ({ prompter }, { localConfig, config, step }) => {
  const capitalizeServiceName = capitalizeFirstLetter(serviceName);
  const typeName = `docker${capitalizeServiceName}Type`;
  if (typeName in config.docker) {
    return;
  }
  const r = {
    docker: {
      ...config.docker,
    },
  };
  const { selectedValue } = await prompter.prompt({
    type: 'select',
    name: 'selectedValue',
    message: `${step}. Docker ${capitalizeServiceName}:`,
    choices: [
      { message: `deploy my own ${capitalizeServiceName}`, value: 'mine' },
      { message: 'use docker external_url', value: 'external_link' },
      { message: 'use external service', value: 'external' },
    ],
  });
  switch (selectedValue) {
  case 'mine':
    const { exposePort } = await prompter.prompt({
      type: 'input',
      name: 'exposePort',
      message: `${step}.1. Docker ${capitalizeServiceName} Expose Port:`,
      initial: defaultExposePort,
    });
    r.docker[`${serviceName}ExposePort`] = exposePort;
    break;
  case 'external_link':
    const { externalLink } = await prompter.prompt({
      type: 'input',
      name: 'externalLink',
      message: `${step}.1. Docker ${capitalizeServiceName} External Url:`,
    });
    r.docker[`${serviceName}ExternalLink`] = externalLink;
    break;
  default:
    break;
  }
  r.docker[typeName] = selectedValue;
  return r;
}
