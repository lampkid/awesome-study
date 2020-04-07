// TODO: ES6 module
module.exports = { 
  SERVER: {
    port: 6004
  },

  DATABASE: {
    host: '10.179.17.9',
    port: '3306',
    backend: 'mysql',
    database: 'midway',
    user: 'root',
    password: '',
    logging: true
  },

  INSTALLED_APPS: [
  ],

  AUTOLOAD: [
    'management',
    'pub',
    'openapi'
  ],

  LOG_PATH: '/data/deploy/midway/dev/logs',

  MIDDLEWARE: [
  ],

  API_PREFIX: '/midway',

  ROOT_ROUTES_CONF: 'bootstrap.routes',
  PROXY: [
    {
      host: 'http://10.0.186.4:8355',
      prefix: '/api/proxy'
    }
  ]
}
