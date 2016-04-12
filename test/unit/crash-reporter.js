exports['CrashReporter'] = {
  surface: function(test) {
    test.expect(5);
    test.equal(typeof CrashReporter.on, 'function');
    test.equal(typeof CrashReporter.off, 'function');
    test.equal(typeof CrashReporter.post, 'function');
    test.equal(typeof CrashReporter.submit, 'function');
    test.equal(typeof CrashReporter.test, 'function');
    test.done();
  }
};

exports['CrashReporter.on'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.pWrite = this.sandbox.stub(Preferences, 'write').returns(Promise.resolve());
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  onSuccess: function(test) {
    test.expect(1);

    CrashReporter.on().then(() => {
      test.equal(this.pWrite.callCount, 1);
      test.done();
    });
  },

  onFailure: function(test) {
    test.expect(2);
    this.pWrite.restore();
    this.pWrite = this.sandbox.stub(Preferences, 'write').returns(Promise.reject());

    // Despite the write failure, we don't _want_ to crash the crash reporter
    CrashReporter.on().then(() => {
      test.equal(this.pWrite.callCount, 1);
      test.equal(this.logsErr.callCount, 1);
      test.done()
    });
  },

};

exports['CrashReporter.off'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.pWrite = this.sandbox.stub(Preferences, 'write').returns(Promise.resolve());
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  offSuccess: function(test) {
    test.expect(1);

    CrashReporter.off().then(() => {
      test.equal(this.pWrite.callCount, 1);
      test.done();
    });
  },

  offFailure: function(test) {
    test.expect(2);
    this.pWrite.restore();
    this.pWrite = this.sandbox.stub(Preferences, 'write').returns(Promise.reject());

    // Despite the write failure, we don't _want_ to crash the crash reporter
    CrashReporter.off().then(() => {
      test.equal(this.pWrite.callCount, 1);
      test.equal(this.logsErr.callCount, 1);
      test.done()
    });
  },

};

exports['CrashReporter.submit'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.logsInfo = this.sandbox.stub(logs, 'info');
    this.pRead = this.sandbox.stub(Preferences, 'read').returns(Promise.resolve('on'));
    this.pWrite = this.sandbox.stub(Preferences, 'write').returns(Promise.resolve());
    this.crPost = this.sandbox.spy(CrashReporter, 'post');
    this.request = this.sandbox.stub(request, 'post', (opts, handler) => {
      return handler(null, {}, '{}');
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  submit: function(test) {
    test.expect(1);

    CrashReporter.submit().then(() => {
      test.equal(this.crPost.callCount, 1);

      // @tikurahul
      //
      // Since we have this.crPost spy, you should look at
      // this.crPost.lastCall.args and write a test that
      // asserts that the right values were have been sent through.
      //

      test.done();
    });
  },
};

exports['CrashReporter.post'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.logsInfo = this.sandbox.stub(logs, 'info');
    this.pRead = this.sandbox.stub(Preferences, 'read').returns(Promise.resolve('on'));
    this.pWrite = this.sandbox.stub(Preferences, 'write').returns(Promise.resolve());
    this.crPost = this.sandbox.spy(CrashReporter, 'post');
    this.request = this.sandbox.stub(request, 'post', (opts, handler) => {
      return handler(null, {}, '{}');
    });
    done();
  },

  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  post: function(test) {
    test.expect(1);

    var labels = 'foo';
    var report = new Error('My error');

    CrashReporter.post(labels, report).then(() => {
      test.equal(this.request.callCount, 1);

      // @tikurahul
      //
      // Since we have this.request spy, you should look at
      // this.request.lastCall.args and write a test that
      // asserts that the right values were have been sent through.
      //
      // Experiment writing other tests that send bad data from the request stub, like:
      //
      //  this.request = this.sandbox.stub(request, 'post', (opts, handler) => {
      //    return handler(null, {}, ')$(*)($*%$%');
      //  });
      //
      //
      test.done();
    });
  },
};
