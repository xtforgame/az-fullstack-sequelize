/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!

This library may be included by front-end code,
please DO NOT put any sensitive information here.

!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

/* eslint-disable import/prefer-default-export */
export { jwtIssuer } from './codegen/test';

const runningMode = 'Test';
const hasuraOrigin = 'http://localhost:8081';
// const hasuraOrigin = 'http://rick.cloud/hasura';
const hasuraEndpoint = `${hasuraOrigin}/v1/graphql`;

export {
  runningMode,
  hasuraEndpoint,
  hasuraOrigin,
};

