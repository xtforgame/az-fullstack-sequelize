/* eslint-disable import/no-dynamic-require, global-require, no-unused-vars */
import path from 'path';
import program from 'commander';

const [nodePath, scriptPath, queryName, ...args] = process.argv;

try {
  const queryScriptPath = path.join(__dirname, queryName);
  const worker = require(queryScriptPath).default;
  worker.run(nodePath, queryScriptPath, program);
} catch (error) {
  console.error('error :', error);
}
