var seneca = require('seneca')();

seneca.add({cmd: 'wordcount', skipShort: true}, (msg, respond) => {
    var words = msg.phrase.split(' ');
    var validWords = 0; 
    for(var i = 0, len = words.length; i < len; i++) {
        if ( words[i].length > 3) {
            validWords++;
        }
    }
    respond(null, {words: validWords});
})

seneca.add({cmd: 'wordcount'}, (msg, respond) => {
    var length = msg.phrase.split(' ').length;
    respond(null, {words: length});
})

seneca.act({cmd: 'wordcount', phrase: 'Hello world this is Seneca'}, (err, response) => {
    if (err) {
        return console.log(err);
    }
    console.log(response);
});

seneca.act({cmd: 'wordcount', skipShort: true,  phrase: 'Hello world this is Seneca'}, (err, response) => {
    if (err) {
        return console.log(err);
    }
    console.log(response);
});
