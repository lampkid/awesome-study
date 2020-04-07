var seneca = require('seneca')();

seneca.add({component: 'greeter'}, function(msg, respond) {
    respond(null, {message: `Hello ${msg.name}`});
});


seneca.act({component: 'greeter', name: 'Bafet'}, (err, response) => {
    if (err) {
        return console.error(err);
    }
    console.log(response.message)
});

