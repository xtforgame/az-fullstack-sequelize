/*
  eslint-disable no-bitwise, no-mixed-operators, no-shadow, prefer-spread,
    no-nested-ternary, no-param-reassign, no-console
*/

import { ReporterBase } from './reporter-base';

export default class WebConsoleReporter extends ReporterBase {
  run(This, runner) {
    // TODO needs to be removed to options somehow
    const reporterQueryParameter = 'test=console';

    const stats = {
      suites: 0, tests: 0, passes: 0, pending: 0, failures: 0,
    };
    const failures = this.failures = []; // eslint-disable-line no-multi-assign
    // const { total } = runner;
    // const { title } = document;
    const calls = [];

    // function parentSuiteTitle(suite) { // eslint-disable-line no-unused-vars
    //   if (!suite.parent) return suite.title;
    //   return `${parentSuiteTitle(suite.parent)} ${suite.title}`;
    // }

    function flagFailures(node) {
      node.hasFailures = true;
      if (node.parent) flagFailures(node.parent);
    }

    function logCall(call) {
      const command = call.shift();
      const suite = call.shift();
      const failures = !suite || suite.hasFailures;
      if (failures || command === 'info' || command === 'error') {
        console[command].apply(console, call);
      }
    }

    function logNewCalls() {
      while (calls.length > 0) {
        logCall(calls.shift());
      }
    }

    runner.stats = stats;

    runner.on('pass', (test) => {
      stats.passes = stats.passes || 0;
      const medium = test.slow() / 2;
      test.speed = test.duration > test.slow() ? 'slow' : (test.duration > medium ? 'medium' : 'fast');
      stats.passes++;
    });

    runner.on('pending', () => {
      stats.pending++;
    });

    runner.on('start', () => {
      stats.start = new Date();
    });

    runner.on('test', (test) => {
      console.log('Running test:', test.title);
    });

    runner.on('fail', (test, err) => {
      stats.failures = stats.failures || 0;
      stats.failures++;
      test.err = err;
      failures.push(test);
      calls.push(['info', null, test.title]);
      calls.push(['error', null, test.err.stack]);
      calls.push(['log', null, { Expected: err.expected, Actual: err.actual }]);
      flagFailures(test.parent);
    });

    runner.on('suite', (suite) => {
      console.log('suite.title :', suite.title);
      stats.suites = stats.suites || 0;
      suite.root || stats.suites++;

      const parameter = `?grep=${encodeURIComponent(suite.fullTitle())}&${reporterQueryParameter}`;
      const { location } = document;
      const url = location.origin + location.pathname + parameter;
      calls.push(['group', suite, suite.title]);
      calls.push(['groupCollapsed', suite, 'url']);
      calls.push(['log', suite, url]);
      calls.push(['groupEnd', suite]);
    });

    runner.on('suite end', (suite) => {
      calls.push(['groupEnd', suite]);
      logNewCalls();
    });

    runner.on('test end', (test) => { // eslint-disable-line no-unused-vars
      stats.tests = stats.tests || 0;
      stats.tests++;
      // const percent = stats.tests / total * 100 | 0;
      // document.title = `${percent}% ${(stats.failures ? `${stats.failures} failures ` : '')}${title}`;
    });

    runner.once('end', () => {
      stats.end = new Date();
      stats.duration = new Date() - stats.start;
      logNewCalls();
      if (stats.errors) console.warn(stats.errors, ' errors');
      if (stats.failures) console.warn(stats.failures, ' failures');
      const skipped = stats.tests - stats.failures - stats.passes;
      if (skipped) console.warn(skipped, ' skipped');
      console.log(stats.passes, ' tests passed');
      console.log(stats.duration / 1000, ' seconds');
      console.log(new Date().toUTCString());
      console.log(`Run all tests ${location.origin}${location.pathname}?${reporterQueryParameter}`); // eslint-disable-line no-restricted-globals
      This.done('done');
    });
  }
}
