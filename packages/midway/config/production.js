module.exports = { 
  SERVER: {
    port: 6008
  },

  DATABASE: {
    host: 'localhost',
    port: '3306',
    backend: 'mysql',
    database: 'midway',
    user: 'root',
    password: 'zhenqu@2019'
  },

  INSTALLED_APPS: [
  ],

  AUTOLOAD: [
    'management',
    'pub',
    'pages'
  ],

  LOG_PATH: '/data/deploy/midway/online/logs',

  MIDDLEWARE: [
  ],

  API_PREFIX: '/midway', 

  ROOT_ROUTES_CONF: 'bootstrap.routes',
  PROXY: [
    {
      host: 'http://10.1.184.0:8355',
      prefix: '/api/proxy'
    }
  ],
}
