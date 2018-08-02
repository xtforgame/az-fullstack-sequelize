export class ReporterBase {
  constructor() {
    this.resolve = null;
    this.reject = null;
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.done = this.done.bind(this);
  }

  run(This, runner) { // eslint-disable-line class-methods-use-this, no-unused-vars
    This.done('done');
  }

  done(result) {
    if (this.resolve) {
      this.resolve(result);
      this.resolve = null;
      this.reject = null;
      this.promise = null;
    }
  }

  get() {
    const This = this;
    const reporter = this.run.bind(this);
    return { reporter: runner => reporter(This, runner), promise: this.promise };
  }
}

export class ReporterFactory {
  static create(Reporter, config) {
    return new Reporter(config);
  }
}
