function init(msg, respond) {
    console.log('plugin inited');
    console.log('do something... DONE!');
    
    respond();
}

function math( options ) {
    this.add({namespace: 'api', role: 'math', cmd: 'sum'}, function (msg, respond) {
        respond(null, {answer: msg.left + msg.right});
    });

    this.add({namespace: 'api', role: 'math', cmd: 'product'}, function (msg, respond) {
        respond(null, {answer: msg.left * msg.right});
    });

    this.wrap('role:math', function(msg, respond) {
        msg.left = Number(msg.left).valueOf();
        msg.right = Number(msg.right).valueOf();

        console.log('msg:', msg, this);

        this.prior(msg, respond);
    });

    this.add({init: 'math'}, init);
}

module.exports = math;


