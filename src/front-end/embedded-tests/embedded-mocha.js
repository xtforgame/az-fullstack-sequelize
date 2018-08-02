import WebConsoleReporter from './reporter';
import { ReporterFactory } from './reporter-base';

function ignorePromiseFailure(promise) {
  return promise.catch(() => Promise.resolve(null));
}

export default class EmbeddedMocha {
  static runningPromise = Promise.resolve(null);

  constructor(config = { ui: 'bdd', Reporter: WebConsoleReporter }) {
    this.config = config;
    this.Reporter = config.Reporter;
    delete config.Reporter; // eslint-disable-line no-param-reassign
  }

  run(testCase) {
    const newTestCasePromise = ignorePromiseFailure(EmbeddedMocha.runningPromise)
    .then(() => {
      const reporterInst = ReporterFactory.create(this.Reporter);
      let { reporter, promise } = reporterInst.get();
      reporter = reporter.bind(reporterInst);
      const config = Object.assign(this.config, { reporter });
      mocha.suite.suites = [];
      mocha.setup(config);
      testCase();
      mocha.run();
      return promise;
    });

    EmbeddedMocha.runningPromise = ignorePromiseFailure(newTestCasePromise);
    return newTestCasePromise;
  }
}
