var fs = require('fs');
var logs = require('./logs');
var path = require('path');

var home = (process.platform.startsWith('win')) ? process.env.HOMEPATH : process.env.HOME;
var preferenceFile = path.join(home, '.tessel', '__preferences.json');

var Preferences = function() {

};

Preferences.prototype.read = function(key, defaultValue) {
  return this.readPreferences()
    .then(contents => {
      if (contents) {
        return contents[key] || defaultValue;
      } else {
        return defaultValue;
      }
    })
    .catch(error => {
      logs.err('Error reading preference', key, error);
      return defaultValue;
    });
};

Preferences.prototype.write = function(key, value) {
  // read existing preferences and write
  var that = this;
  return new Promise((resolve, reject) => {
    that.readPreferences()
      .then(contents => {
        contents = contents || {};
        contents[key] = value;
        fs.writeFile(preferenceFile, JSON.stringify(contents), function(error) {
          if (error) {
            logs.err('Error writing preference', key, value);
            reject(error);
          } else {
            resolve();
          }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

Preferences.prototype.readPreferences = function() {
  return new Promise((resolve, reject) => {
    fs.exists(preferenceFile, (exists) => {
      if (exists) {
        fs.readFile(preferenceFile, (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(JSON.parse(data));
          }
        });
      } else {
        // we don't have any local preferences
        // return falsy value
        resolve();
      }
    });
  });
};

module.exports = Preferences;
