/**
 * node server
 */
var app = require('../bootstrap/app');
var config = require('../core/config');

var server = app.listen(config.config(null, 'SERVER.port'), function () {
    console.log('server is running on %s', server.address().port);
});

module.exports = server;
