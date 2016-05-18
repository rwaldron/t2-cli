var update = require('./update-fetch');
var logs = require('./logs');
var flash = require('./flash');

module.exports = function unbrick(opts, tessel) {
  return new Promise(function(resolve, reject) {
    if (opts.openwrt) {
      logs.info('Proceeding with updating OpenWrt...');

      // download images
      return update.fetchUnbrick()
        .then(function(result) {
          flash(tessel.connection, result.uboot, result.squashfs, function onFlash(err) {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        })
        .catch((e) => {
          reject(e);
        });
    }

    return reject(new Error('You need to specify --openwrt to proceed.'));
  });
};
