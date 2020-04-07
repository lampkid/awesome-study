var seneca = require('seneca')();

seneca.add({anyRole: 'math', cmd: 'sum'}, function(msg, respond) {
    var sum = msg.left + msg.right;
    respond(null, {answer: sum});
});

seneca.add({role: 'math', cmd: 'product'}, function(msg, respond) {
    var product = msg.left * msg.right;
    respond(null, {answer: product});
});

seneca.act({anyRole: 'math', cmd: 'sum', left: 1, right: 2}, (err, result) => {
    if (err) {
        return console.error(err);
    }
    console.log(result)
});

//seneca.act({role: 'math', cmd: 'product', left: 1, right: 2}, console.log);
