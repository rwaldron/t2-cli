#!/usr/bin/env node

// System Objects
var child_process = require('child_process');
var fs = require('fs');

// Third Party Dependencies
// ...

// Internal
var log = require('../lib/log');

module.exports.install = function() {
  return new Promise(function(resolve, reject) {
    if (process.platform === 'linux') {
      var rules_name = '85-tessel.rules';
      var dest = '/etc/udev/rules.d/' + rules_name;
      var rules = fs.readFileSync(__dirname + '/../resources/' + rules_name);

      try {
        fs.writeFileSync(dest, rules);
      } catch (e) {
        if (e.code === 'EACCES') {
          log.info(`Could not write to ${dest}`);
          log.info('Run "sudo t2 install-drivers"');
          return -1;
        } else {
          throw e;
        }
      }
      log.info(`udev rules installed to ${dest}`);


      var udevadm = child_process.spawn('udevadm', ['control', '--reload-rules']);
      udevadm.on('close', function(code) {
        if (code !== 0) {
          log.error('Error reloading udev');
          return reject(code);
        } else {
          log.info('Done. Unplug and re-plug Tessel to update permissions.');
          return resolve(code);
        }
      });
    } else {
      log.info('No driver installation necessary.');
      return resolve();
    }
  });
};
