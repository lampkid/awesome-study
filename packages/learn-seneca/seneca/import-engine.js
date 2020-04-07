var seneca = require('seneca')();

var money = require('./money');
seneca.use(money)
    .use('entity');

seneca.use('jsonfile-store',{
      folder:'json-data'
})

seneca.listen({port: '9856', pin: 'namespace:api,class:money'});
seneca.client({port: '9856', pin: 'namespace:api,class: money'});
