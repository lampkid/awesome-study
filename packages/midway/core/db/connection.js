const Sequelize = require('sequelize');
const Config = require('../config');
const { host, port, database, user, password, backend, pool, logging: loggingOption = false } = Config.config(null, 'DATABASE');
// 时区设置
const moment = require('moment');
moment.tz.setDefault('Asia/Shanghai');
// 单例
class DBConnection {

  // static conn; // TODO: ES6

  static connect() {
    if (!DBConnection.conn) {
      DBConnection.conn = new Sequelize(database, user, password, {
        host,
        port,
        dialect: backend,
        logging: loggingOption ? console.log : false,
        dialectOptions: {
          // useUTC: false,
          dateStrings: true,
          typeCast: function (field, next) {
            if (field.type === 'DATETIME') {
              return field.string();
            }
            return next();
          },
          
        },
        define: {
          charset: "utf8mb4",
          collate: "utf8mb4_unicode_ci",
          supportBigNumbers: true
        },
        pool: pool || {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        timezone: '+08:00'

        // SQLite only
        // storage: 'path/to/database.sqlite'
      });
    }
    return DBConnection.conn;
  }

}

const conn = DBConnection.connect();
DBConnection.query = conn.query;


module.exports = DBConnection;

// Or you can simply use a connection uri
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
