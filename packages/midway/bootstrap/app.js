const Koa = require('koa');
const path = require('path');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('@koa/cors');
const koaBody = require('koa-body');

const routes = require('./routes');
const settings = require('../settings');
const env = require('../env');

const APP_PATH = settings.APP_PATH;

const DB_ENABLED = false;
const TEMPLATE_ENGINE = true;
const STATIC_SERVER = true;
const RAL = false;

const PROXY = true;
const SESSION = false;

if (DB_ENABLED && env !== 'production') {
  const syncdb = require('../core/db/sync');
  syncdb(APP_PATH);
}

if (RAL) { 
  const ral = require('../core/ral');
  ral.init();
}

const autoload = require('../core/autoload');
const Config = require('../core/config');
const error = require('../core/error');

const app = new Koa();

// error handler
onerror(app);

// 在中间件的最后捕获错误，并处理错误信息

app.use(logger());

app.use(error);

if (SESSION) {
  /*
   * todo: 先用file作为session存储，后续可考虑数据库和redis
   * 注意清除老的session产生的文件
   * #!/bin/sh
   * find /app/cacheDir/ -mtime +30 -name "*.*" -exec rm -Rf {} \;
   * crontab:
   * crontab -l
   * 10 4 1 * * /bin/sh /root/soft_shell/clean-cache.sh
   */
  const FileStore = require('koa-filestore');
  const session = require('koa-session');

  app.keys = ['secret-key'];
  app.use(session(app, {
    // other session config
    key: 'koa-sess',
    store: new FileStore({
      cacheDir: '/tmp/session', // path.resolve(__dirname, '../session/'), // Dir to store session files, unencrypted.
      maxAge: 86400000, // Default maxAge for session, used if the maxAge of `koa-session` is undefined, avoid the session's key in cookies is stolen.
    })
  }));

  app.use(ctx => {
    // ignore favicon
    if (ctx.path === '/favicon.ico') return;

    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    console.log('session:', ctx.session);
    ctx.body = JSON.stringify(ctx.session, null, 2);
  });
}

if (STATIC_SERVER) {
  // static server
  app.use(require('koa-static')(path.resolve(__dirname, '../public')));
}

if (TEMPLATE_ENGINE) {
  // template engine
  app.use(require('koa-views')(path.resolve(__dirname, '../views'), {
    extension: 'ejs' // ejs
  }));
}

if (PROXY) {
  const proxy = require('koa-proxy');
  const proxiesConfig = Config.config(null, 'PROXY');
  proxiesConfig.forEach(proxyConfig => {
    const { host, prefix } = proxyConfig;
    const match = new RegExp(`^${prefix}`.replace(/\//g, '\\/'))
    app.use(proxy({
      host,
      match,
      map: function(path) {
        return path.replace(match, '');
      },
      jar: true
    }));
  });
}

/*
 * upload file
 */
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2*1024*1024
  }
}));

//cors
app.use(cors({
  credentials: true,
}));

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  queryString: {
    depth: Infinity,
    allowDots: false,
  }
}));
app.use(json());

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${Date.now()} - ${ctx.method} ${ctx.url} - ${JSON.stringify(ctx.query, null, 2)} - ${JSON.stringify(ctx.body, null, 2)} - ${ms}ms`);
});

autoload(app, APP_PATH, Config.config(null, 'AUTOLOAD'), Config.config(null, 'API_PREFIX'));

// routes
routes(app);

// 最后捕获，并 log
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
