var qs = require('qs');

var seneca = require('seneca')();

//var math = require('./math');
var money = require('./money');

seneca.use(money)
    .use('entity')
    seneca.use('jsonfile-store',{
          folder:'json-data'
    })
    /*
    .use('mongo-store', {
        name: 'money',
        host: '127.0.0.1',
        port: '27017',
        options: {}
    })
    */
    
//action配置
seneca.add({namespace:'webapi'}, function(response, done) {

        const query = response.args.query || {};

        //todo: 做get、post、request三种数据来源汇总,类似php,统一通过函数获取数据
         var body = response.args.body;
         var bodyJSON = body && qs.parse(body);
         var data = bodyJSON || response.args.query || {};
         console.log('response:----', data);

         //class action关键字，决不允许前端传参数使用,所以此处需要在加一个中间层按需给不同微服务传入数据
         seneca.act({namespace: 'api'}, Object.assign({class: response.class, action: response.action, criteria: response.args.params.criteria}, data), function(err, result){
            if (err) {
                return console.error(err);
            }
            console.log('sum:', response.args.params.operation, result)
            done(null, result);
        });



});



/*
seneca.act('role:web', {
    routes: Routes,

});
*/

seneca.ready(function(err) {
    // 路由配置
    var Routes = [
        { // routes
            prefix: '/api/money',
            pin: 'namespace:webapi,class:money,action:*',

            map: {
                fetch: {POST: true},
                get: {POST: true, GET: true },
                save: {GET: true, POST: true},
                edit: {GET: false, POST: true},
                remove: {GET: true, POST: true, DELETE: false},
                mark: {GET: true, POST: true},
                provider: {GET: true, POST: true}
            }
        }
    ];

    var express = require('express');




    var context = express;

    var app = express();

    var senecaWebConfig = {
        context: app,
        routes: Routes,
        adapter: require('seneca-web-adapter-express'),
        options: {
          parseBody: false
        }
    }


    //var senecaWeb = seneca.export('web'); 
    var senecaWeb = require('seneca-web');


    seneca.use(senecaWeb, senecaWebConfig)

    app.use(require('body-parser').json()) //这个没用，设置了body还是字符串

    var filename = __dirname + '/index.html'
    app.get('/', function(req, res, next) {
	res.sendFile(filename);
	})
    app.listen(3000);


    

});




