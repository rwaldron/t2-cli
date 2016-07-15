// Test dependencies are required and exposed in common/bootstrap.js
require('./bootstrap');

function TesselSimulator(options) {

  // If options weren't provided
  if (!options) {
    // create a default
    options = {};
  }

  var simConnection = {
    exec: function(command, options, callback) {
      // Account for the case where options are not provided but a callback is
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }

      // Account for the case where a callback wasn't provided
      if (callback === undefined) {
        // Dummy callback
        callback = function() {};
      }

      if (!Array.isArray(command)) {
        throw new Error('Invalid command passed to exec.');
      }

      tessel._rps.control.write(command.join(' '));

      return callback(null, tessel._rps);
    },

    end: function() {
      return Promise.resolve();
    },

    close: function() {
      return Promise.resolve();
    },

    open: function() {
      return Promise.resolve();
    },

    connectionType: options.type || 'USB',

  };

  var tessel = new Tessel(simConnection);
  tessel._rps = new RemoteProcessSimulator();

  // If a name was provided, set the Tessel name
  if (options.name) {
    tessel.name = options.name;
  }

  // If a serial number was provided and this is a USB connection
  if (options.serialNumber && options.type === 'USB') {
    // Set the serialNumber
    tessel.serialNumber = options.serialNumber;
  }

  // If options specifies authorized, make this Tessel authorized
  if (options.type === 'LAN') {
    if (options.authorized !== true) {
      simConnection.authorized = options.authorized || false;
    } else {
      simConnection.authorized = options.authorized;
    }
  }

  return tessel;
}

Tessel.prototype.mockClose = function() {
  this.close();
  process.removeAllListeners('exit');
  process.removeAllListeners('SIGINT');
};

module.exports = TesselSimulator;
