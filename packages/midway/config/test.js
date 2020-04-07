module.exports = { 
  SERVER: {
    port: 6005
  },

  DATABASE: {
    host: 'localhost',
    port: '3306',
    backend: 'mysql',
    database: 'midway_test',
    user: 'root',
    password: 'zhenqu@2019',
    logging: true
  },

  INSTALLED_APPS: [
  ],

  AUTOLOAD: [
    'management',
    'pub',
    'pages'
  ],

  MIDDLEWARE: [
  ],

  LOG_PATH: '/data/deploy/midway/test/logs',
  API_PREFIX: '/midway',
  ROOT_ROUTES_CONF: 'bootstrap.routes',
  PROXY: [
    {
      host: 'http://10.0.186.6:8355',
      prefix: '/api/proxy'
    }
  ]
}
