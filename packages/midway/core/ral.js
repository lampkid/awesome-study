// init RAL
const RALLib = require('node-ral');
const RAL = RALLib.RAL;

const path = require('path');

const env = require('../env');

const Config = require('./config');

const RAL_DIR = path.join(__dirname, `../config/${env}/ral`);

module.exports.init = function () {
  RAL.init({
    confDir: RAL_DIR,
    logger: {
      log_path: Config.config(null, 'LOG_PATH')
    }
  });
}

module.exports.ralP = RALLib.RALPromise;

module.exports.getConf = RALLib.Config.getConf;

