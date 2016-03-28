var logs = require('./logs');
var os = require('os');
var packageJson = require('../package.json');
var Preferences = require('./preferences');
var request = require('request');
var tags = require('common-tags');

// the value of the crash reporter preference
// the value has to be one of 'on' or 'off'
var CRASH_REPORTER_PREFERENCE = 'crash.reporter.preference';
var SUBMIT_CRASH_URL = 'http://tessel-error-reporter.appspot.com/crashes/submit';

// override for testing
if (process.env.DEV_MODE === 'true') {
  SUBMIT_CRASH_URL = 'http://localhost:8080/crashes/submit';
}

var preferences = new Preferences();
var CrashReporter = {};

CrashReporter.turnOff = function() {
  return preferences
    .write(CRASH_REPORTER_PREFERENCE, 'off')
    .catch(error => {
      // do nothing
      // do not crash the crash reporter :)
      logs.err('Error turning off crash reporter preferences', error);
    });
};

CrashReporter.turnOn = function() {
  return preferences
    .write(CRASH_REPORTER_PREFERENCE, 'on')
    .catch(error => {
      // do nothing
      // do not crash the crash reporter :)
      logs.err('Error turning on crash reporter preferences', error);
    });
};

CrashReporter.submit = function(report) {
  preferences.read(CRASH_REPORTER_PREFERENCE, 'on')
    .then(value => {
      if (value === 'on') {
        var labels = tags.stripIndent `
          ${packageJson.name},
          CLI version: ${packageJson.version},
          Node version: ${process.version},
          OS platform: ${os.platform()},
          OS release: ${os.release()}
        `;

        CrashReporter.postRequest(labels, report)
          .then(() => {
            logs.info('Done !');
          })
          .catch(error => {
            logs.err('Error submitting crash report', error);
          });
      }
    })
    .catch(error => {
      // do nothing
      // do not crash the crash reporter :)
      logs.err('Error submitting crash report', error);
    });
};

CrashReporter.postRequest = function(labels, report) {
  return new Promise((resolve, reject) => {
    request.post({
      url: SUBMIT_CRASH_URL,
      form: {
        crash: report,
        labels: labels,
        f: 'json'
      }
    }, (error, httpResponse, body) => {
      try {
        if (error) {
          reject(error);
        } else {
          var json = JSON.parse(body);
          if (json.error) {
            reject(json.error);
          } else {
            resolve();
          }
        }
      } catch (exception) {
        reject(exception);
      }
    });
  });
};

var onError = error => {
  return CrashReporter.submit(error.stack);
};

var CrashReportsHelper = function() {

};

CrashReportsHelper.turnOff = () => {
  return CrashReporter.turnOff();
};

CrashReportsHelper.turnOn = () => {
  return CrashReporter.turnOn();
};

CrashReportsHelper.testSubmit = () => {
  return Promise.reject(new Error('Testing the crash reporter'));
};

process.on('unhandledRejection', onError);
process.on('uncaughtException', onError);

module.exports = CrashReportsHelper;
