var Tessel = require('./tessel');
var update = require('../update-fetch');
var logs = require('../logs');
var flash = require('../flash');

Tessel.prototype.unbrick = function unbrick(opts) {
  var usbConnection = this.connection;
  return new Promise(function(resolve, reject) {
    if (opts.openwrt) {
      logs.info('Proceeding with updating OpenWrt...');

      // download images
      return update.fetchUnbrick()
        .then((result) => {
          flash(usbConnection, result.uboot, result.squashfs, (err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
    }
    return reject(new Error('You need to specify --openwrt to proceed.'));
  });
};
