var express     = require('express'),
    app         = express(),
    http        = require('http').Server(app),
    io          = require('socket.io')(http),
    launcher    = new (require('./usblauncher'))();

app.use(express.static(__dirname + '/public'));

// Convenience routes to get the main and stream pages
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/stream', function(req, res){
    res.sendFile(__dirname + '/public/stream.html');
});

// Send commands to the launcher that come from index.html
io.on('connection', function(socket){
    socket.on('command', function(msg){
        try {
            launcher.sendCommand(msg);
        } catch (e) {
            console.log(e);
        }
    });
});

// Start the web server
http.listen(3000, function(){
    console.log('listening on *:3000');
});

// Start the broadcasting server
require('./broadcast');
