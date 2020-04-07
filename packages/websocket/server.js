var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
 
app.get('/', function(req, res){
    res.sendfile("./chat.html");
});
                                           
io.on('connection', function(socket){
    setInterval(function(){
        io.emit('time', (function(){
            return {
                time: + new Date()
            }; 
        })()); 
    }, 73);
}); 
 
http.listen(3000, function(){
    console.log('listen 3000');
});
