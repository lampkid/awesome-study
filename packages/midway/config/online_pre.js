module.exports = { 
  SERVER: {
    port: 6007
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
    'management',
    'pub'
  ],

  MIDDLEWARE: [
  ],

  LOG_PATH: '/data/deploy/midway/online_pre/logs',
  API_PREFIX: '/midway',
  ROOT_ROUTES_CONF: 'bootstrap.routes',
  PROXY: [
    {
      host: 'http://10.1.183.243:8355',
      prefix: '/api/proxy'
    }
  ]
}
