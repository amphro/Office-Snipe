
var SocketServer = require("ws").Server;

/**
 * Broadcast all messages to all clients
 */
SocketServer.prototype.broadcast = function broadcast(data) {
    for(var i in this.clients) {
        if (this.clients[i].readyState === 1) {
            this.clients[i].send(data);
        }
    }
};

SocketServer.prototype.numberOfConnectedClients = function numberOfConnectedClients() {
    return this.clients.length;
}

var server = new SocketServer({
    port : 3001
});

server.on('connection', function connection(webSocket) {
    console.log(server.numberOfConnectedClients() + ' connected clients.');

    // Broadcast the message
    webSocket.on('message', function incoming(message) {
        server.broadcast(message);
    });
});

console.log('broadcasting on *:3001');

module.exports = server;
