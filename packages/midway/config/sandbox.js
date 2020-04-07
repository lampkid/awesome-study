module.exports = { 
  SERVER: {
    port: 6006
  },

  DATABASE: {
    host: 'localhost',
    port: '3306',
    backend: 'mysql',
    database: 'midway',
    user: 'root',
    password: 'midway',
    logging: true
  },

  INSTALLED_APPS: [
  ],

  AUTOLOAD: [
    'management'
  ],

  MIDDLEWARE: [
  ],

  LOG_PATH: '/data/deploy/midway/sandbox/logs',
  API_PREFIX: '/midway',
  ROOT_ROUTES_CONF: 'bootstrap.routes',
  PROXY: [
    {
      host: 'http://10.0.186.5:8355',
      prefix: '/api/proxy'
    }
  ]
}
