exports['Preferences'] = {
  surface: function(test) {
    test.expect(3);
    test.equal(typeof Preferences.read, 'function');
    test.equal(typeof Preferences.write, 'function');
    test.equal(typeof Preferences.load, 'function');
    test.done();
  }
};

exports['Preferences.load'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.logsInfo = this.sandbox.stub(logs, 'info');

    this.exists = this.sandbox.stub(fs, 'exists', (file, handler) => {
      handler(true);
    });
    this.readFile = this.sandbox.stub(fs, 'readFile', (file, handler) => {
      handler(null, '{}');
    });
    done();
  },
  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  load: function(test) {
    test.expect(2);

    Preferences.load().then(() => {
      test.equal(this.exists.callCount, 1);
      test.equal(this.exists.lastCall.args[0].endsWith('preferences.json'), true);
      test.done();
    });
  },
};

exports['Preferences.read'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.logsInfo = this.sandbox.stub(logs, 'info');

    this.exists = this.sandbox.stub(fs, 'exists').returns(true);
    this.readFile = this.sandbox.stub(fs, 'readFile', (file, handler) => {
      handler(null, '{}');
    });

    done();
  },
  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  read: function(test) {

    // @tikurahul
    //
    // This is all you!
    //
    // Remember, you can change the stub to call handler(...) with
    // whatever you want. This way, you can manipulate the program
    // and test that it does the right things.

    test.done();
  }
};

exports['Preferences.write'] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.logsErr = this.sandbox.stub(logs, 'err');
    this.logsInfo = this.sandbox.stub(logs, 'info');

    this.exists = this.sandbox.stub(fs, 'exists').returns(true);
    done();
  },
  tearDown: function(done) {
    this.sandbox.restore();
    done();
  },

  write: function(test) {

    // @tikurahul
    //
    // This is all you!

    test.done();
  }
};
