const fs = require('fs');
const path = require('path');

const validator = require('./validator');

var Router = require('koa-router');

const includeFilesRe = /^.*\.controller.js$/;
const actionRe = /Action$/;

function getClassName(Xlass) {
  return Xlass.prototype.constructor.name;
}

function getClassAttrs(instance) {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
}

function getControllerName(Xlass) {
  const xlassName = getClassName(Xlass);
  return xlassName.replace(/Controller$/, '').toLowerCase();
  
}

function getControllerActionNames(instance) {
  const attrs = getClassAttrs(instance);
  const actions = [];
  attrs.forEach(function (attr) {
    if (attr.match(actionRe)) {
      actions.push(attr.replace(actionRe, ''));
    }
  });

  return actions;
}

function installSchema(prefix, ctrlName, actionName, xontroller) {
  const schemaName = [ prefix, ctrlName, actionName].join('-');
  const { action: { [actionName]: { schemaType, schema } = {} } = {} } = xontroller;
  validator.installSchema(schema, schemaType, schemaName);
}

function validateRoute(prefix, ctrlName, actionName, xontroller) {
  const schemaName = [ prefix, ctrlName, actionName].join('-');
  const { action: { [actionName]: { schemaType, schema } = {} } = {} } = xontroller;
  return validator.validateRoute(schemaName, schemaType)
}

function getCustomRoute(xontroller, actionName) {
  const { action: { [actionName]: { route } = {} } = {} } = xontroller;
  return route;
}

function getRequestMethod(xontroller, actionName) {
  const { action: { [actionName]: { method = 'all' } = {} } = {} } = xontroller;
  return method;
}

// TODO: support controller dir recursive
function requireControllers(appDir, app, apiPrefix = '') {
  let files = [];
  try {
    files = fs.readdirSync(appDir);
  } catch (e) {
    console.log('get app controllers error:', appDir);
  }
  
  for (let length = files.length, i = 0; i < length; i++) {
    const file = files[i];
    
    const absPath = path.join(appDir, file);
    if (fs.statSync(absPath).isFile() && includeFilesRe.test(file)) {
      const Controller = require(absPath);
      const ctrl = new Controller();
      const ctrlName = getControllerName(Controller);
      const actionNames = getControllerActionNames(ctrl);
      const prefix = Controller.prefix || '';
      const router = new Router({
        prefix: `${apiPrefix}${prefix}`
      });
      actionNames.forEach(function (actionName) {
        const customRoute = getCustomRoute(Controller, actionName);
        const route = customRoute ? customRoute : `/${ctrlName}/${actionName}`;
        const params = [prefix, ctrlName, actionName, Controller];
        installSchema(...params);
        const method = getRequestMethod(Controller, actionName);
        router[method](route, ctrl._init.bind(ctrl), validateRoute(...params), ctrl[`${actionName}Action`].bind(ctrl)); 
        if (actionName === 'index') {
          router[method](`/${ctrlName}`, ctrl._init.bind(ctrl), validateRoute(...params), ctrl[`${actionName}Action`].bind(ctrl)); 
        }
        console.log('route loaded:',route);
      });
      app.use(router.routes())
    }
  }
}

module.exports = function(app, appPath, autoloadApps = [], apiPrefix) {
  let apps = [];
  try {
    apps = fs.readdirSync(appPath);
  } catch (e) {
    console.log('get app dir error:',appPath);
  }

  for (let length = apps.length, i = 0; i < length; i++) {
    const  appDir = apps[i];
    if (autoloadApps.includes(appDir)) {
      const absPath = path.join(appPath, appDir);
      if (fs.statSync(absPath).isDirectory()) {
        requireControllers(absPath, app, apiPrefix);
      }
    }
  }
}
