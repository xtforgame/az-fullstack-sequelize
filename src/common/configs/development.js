/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!

This library may be included by front-end code,
please DO NOT put any sensitive information here.

!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

/* eslint-disable import/prefer-default-export */
export { jwtIssuer } from './codegen/development';

const runningMode = 'Development';
const hasuraOrigin = 'http://localhost:8081';
const hasuraEndpoint = `${hasuraOrigin}/v1/graphql`;

export {
  runningMode,
  hasuraEndpoint,
  hasuraOrigin,
};
