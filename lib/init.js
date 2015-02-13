var initJson = require('init-package-json');
var path = require('path');
var fs = require('fs');

// Initialize package.json with all default settings
function init(opts) {
  console.log('Initializing Tessel repository with default settings.');
  var dir = process.cwd();
  fs.createReadStream(__dirname + '/../resources/default-package.json').pipe(fs.createWriteStream(dir+'/package.json'));
  console.log('package.json created with default settings.')
}

// NOT WORKING YET
// Initialize package.json interactively
function interactive(opts) {
  var dir = process.cwd();
  var initFile = path.resolve(process.env.HOME, '.npm-init');
  console.log(initFile)
  var configData = {};

  initJson(dir, initFile, configData, function (err, data) {
    if(err) {
      console.error('\nError running init:', err);
    }
  });
}

module.exports.init = init;
module.exports.interactive = interactive;
