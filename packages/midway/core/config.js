const path = require('path');
const _ = require('lodash');
const env = require('../env');
const sysconfig = require('../settings');
const ROOT_PATH = sysconfig.ROOT_PATH;

const CONFIG_PATH = sysconfig.CONFIG_PATH;;

function use(module) {
  const modulePath = path.join(ROOT_PATH, module);
  return require(modulePath);
}

function loadConfig(configModule) { 
  try {
    return require(`${CONFIG_PATH}/${configModule}`);
  } catch (e) {
    console.log('expected exception, configPath not exist:', CONFIG_PATH, configModule)
  }
}

class Config {
  static config(module, key) {
    const envConfigPath = env;
    // config/index, global config
    const rootConfig = loadConfig('index');

    // config/redis, global module config, is not environment specified
    const moduleConfig = module ? loadConfig(module) : null;


    // config/development, specified environment config
    const envRootConfig =  loadConfig(envConfigPath);
    const envRootConfigByModule = module ? envRootConfig[module] : envRootConfig;

    // config/development/redis, environment module config, environment specifiled
    const envModuleConfig = module ? loadConfig(`${env}/${module}`) : null;

    // shadow merge，not deep merge
    const configObj = { ...rootConfig, ...moduleConfig, ...envRootConfigByModule, ...envModuleConfig }; 

    return key ? _.get(configObj, key) : configObj;
  }
}

module.exports = Config;
