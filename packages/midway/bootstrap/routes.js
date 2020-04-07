/**
 *  application routes that not autoload
 */

'use strict';

var mount = require('koa-mount');

function routes(app) {
  // mount the route according to the INSTALLED_APPS and apps/
  // app.use(mount('/api', require('../apps/api/api.router')));
}

module.exports = routes;
