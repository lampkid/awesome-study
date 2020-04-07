// TODO: ES6 module
module.exports = { 
  SERVER: {
    port: 3000
  },

  DATABASE: {
    host: 'localhost',
    port: '3306',
    backend: 'mysql',
    database: 'midway',
    user: 'root',
    password: 'zhenqu@2019',
    logging: true
  },

  INSTALLED_APPS: [
  ],

  AUTOLOAD: [
    'management',
    'pub',
    'pages',
  ],

  MIDDLEWARE: [
  ],

  LOG_PATH: "/tmp/midway/logs",
  API_PREFIX: '/midway',
  ROOT_ROUTES_CONF: 'bootstrap.routes',
  PROXY: [
    {
      host: 'http://10.0.186.4:8355',
      prefix: '/api/proxy'
    }
  ]
}
