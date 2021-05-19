---
to: src/common/configs/codegen/development.js
---
const jwtIssuer = '<%= common.jwtIssuer %>';
const projectNames = {
  name: '<%= project.name %>',
  displayName: '<%= project.displayName %>',
  camelName: '<%= project.camelName %>',
  dashedName: '<%= project.dashedName %>',
  underscoredName: '<%= project.underscoredName %>',
  safename: '<%= project.safename %>',
};

export {
  jwtIssuer,
  projectNames,
};
