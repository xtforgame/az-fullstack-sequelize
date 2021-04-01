/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!

This library may be included by front-end code,
please DO NOT put any sensitive information here.

!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

/* eslint-disable import/prefer-default-export */
export { jwtIssuer } from './codegen/production';

const runningMode = 'Production';
const hasuraEndpoint = 'http://rick.cloud:22004/v1/graphql';

export {
  runningMode,
  hasuraEndpoint,
};
