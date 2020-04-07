function init(msg, respond) {
    console.log('money plugin inited');
    console.log('do something... DONE!');
    respond();
}

function charCodes(str) {
  return str.split('').map(char => char.match(/\d+/) ? char : char.charCodeAt(0)).join('')
}


function money( options ) {

    var providerData = {
        status: {
            9: '已报错',
            '': 'Normal',
            //10: '已删除'
        }
    };

    this.add({namespace: 'api', class: 'money', action: 'provider'}, function (msg, respond) {
        respond(null, {errno: 0, errmsg: 'success', data: providerData});
    });

    this.add({namespace: 'api', class: 'money', action: 'fetch'}, function (msg, respond) {
        var moneys = this.make$('money');
        var where = (msg && msg.filter) || {};
        var page = msg.page || 1, size = msg.page_size || 10;
        var lastPage = ( page -1 ) < 0 ? 0 : page -1;
        var start = lastPage * size, end = page * size;
        moneys.list$({ ...where, sort$: { no: 1 }, skip$: start, limit$: size }, function(err, result) {
          var curPageResult = result.sort(function(a, b) {
            const preNoDelta = charCodes(a.pre_no) - charCodes(b.pre_no)
            if (preNoDelta === 0) {
              const noDelta = charCodes(a.no) - charCodes(b.no)
              console.log('sort:', noDelta, preNoDelta, a.pre_no, b.pre_no, a, b);
              return noDelta;
            }
            return preNoDelta;
          }).slice(start, end); //数据库查询不支持offset？
            console.log('fetch only list', err, result);
            respond(err, {errno: 0, errmsg: 'success', data: curPageResult, count: result.length} );
        }); //错误优先回调
    });

    this.add({namespace: 'api', class: 'money', action: 'fetch', criteria: 'byCat'}, function (msg, respond) {
        console.log('byCat:');
        var moneys = this.make('money');
        moneys.list$({cat: msg.cat}, respond); //错误优先回调 ,function (err, result)
    });

    this.add({namespace: 'api', class: 'money', action: 'fetch', criteria: 'byNo'}, function (msg, respond) {
        var moneys = this.make('money');
        moneys.list$({no: msg.no}, respond); //错误优先回调 ,function (err, result)
    });

    this.add({namespace: 'api', class: 'money', action: 'fetch', criteria: 'byId'}, function (msg, respond) {
        var moneys = this.make('money');
        moneys.load$({id: msg.id}, respond); //id 
    });

    this.add({namespace: 'api', class: 'money', action: 'get'}, function (msg, respond) {
        var moneys = this.make('money');
        console.log('++++++++++:', msg.id);
        moneys.load$({id: msg.id}, function(err, result) {
            respond(err, {errno:0 , errmsg: 'success',  data: result});
        }); //id 
    });

    this.add({namespace: 'api', class: 'money', action: 'add'}, function (msg, respond) {
        console.log('here you are, ', msg);
        var moneys = this.make('money');
        var data = msg.data;
        console.log('add data:', data);

        moneys.data$(data).save$(function(err, money) {
            console.log('save data ret', err, money);
            respond(err, money.data$(false)) //false表示不返回数据元信息，如实体名、库名等;
        });
    });


    this.add({namespace: 'api', class: 'money', action: 'remove'}, function (msg, respond) {
      console.log('remove...', msg.id, msg)
        this.make('money').remove$(msg.id, function(err, result) {
            if (err) {
                respond({errno: -1, errmsg: 'error'});
            }
            else {
                respond({errno: 0, errmsg: 'success', data: result});
            }
        });
    });

    this.add({namespace: 'api', class: 'money', action: 'mark'}, function (msg, respond) {
        if (msg.id) {

            //todo 判断msg.status有效性
            
            this.act({namespace: 'api', class: 'money', action: 'fetch', criteria: 'byId', id: msg.id}, function (err, result) {

                result.status = msg.status;
                result.save$(function(err, money) {
                    if (err) {
                        respond({errno: -1, errmsg: 'server error' + err});
                    }
                    respond({errno: 0, errmsg: 'success', data: money.data$(false)});
                });
            });
        }
        else {
            respond({errno: -1, errmsg: 'params error'});
        }

    });

    this.add({namespace: 'api', class: 'money', action: 'save'}, function (msg, respond) {
        console.log('save...', msg);
        if (msg.data && msg.data.no) {
            this.act({namespace: 'api', class: 'money', action: 'fetch', criteria: 'byNo', no: msg.data.no}, function (err, result) {
              console.log('query...', result);
                if (msg.id && result && result[0] && msg.id != result[0].id) {
                    respond({errno: -1, errmsg: 'no exist'});
                } else if( !msg.id && result && result[0]) {
                  respond({ errno: -1, errmsg: "has exist"})
                } else {
                  if (msg.id) {
                      
                      this.act({namespace: 'api', class: 'money', action: 'fetch', criteria: 'byId', id: msg.id}, function (err, result) {

                          console.log('save------------------', msg.id, msg.data);

                          result.data$(msg.data);
                          result.save$(function(err, money) {
                              if (err) {
                                  respond({errno: -1, errmsg: 'server error' + err});
                              }
                              respond({errno: 0, errmsg: 'success', data: money.data$(false)});
                          });
                      });
                  }
                  else {
                      this.act(Object.assign(msg, {namespace: 'api', class: 'money', action: 'add'}), function(err, result) {
                              console.log('act add...', err, result);
                              respond({errno: 0, errmsg: 'success', data: result});
                      });
                  }


                }
            });
        }


    });
    

    this.add({init: 'money'}, init);
}

module.exports = money;
