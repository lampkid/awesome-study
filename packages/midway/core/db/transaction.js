const Connection = require('./connection');
const connection = Connection.connect();

const transaction = connection.transaction.bind(connection);
module.exports = transaction;
