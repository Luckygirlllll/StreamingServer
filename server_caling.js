http = require('http');
os = require('os');
WebSocketServer = new require('ws');

var interfaces = os.networkInterfaces()
var addresses = []
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family == 'IPv4' && !address.internal) {
            addresses.push(address.address)
        }
    }
}

var socketClients = [];
var bytearray = require('bytearray');
var ByteBuffer = require("bytebuffer");
var ar2;

var sampleRate = 11025;
var bufferSize = 9728;
var receiveData = [];
var sampleRate = 11025;

/*** HTTP SERVER ***/

http.createServer(function (req, res) {

    if (req.method == 'POST') {
        console.log('\nHTTP POST');
    }

    if (req.method == 'GET') {
        console.log('\nHTTP GET');
    }

}).listen(8000, addresses[0]);
console.log('HTTP server running at', addresses[0], ':8000');


/*** WEBSOCKET SERVER ***/

var webSocketServer = new WebSocketServer.Server({port: 8080});

webSocketServer.on('connection', function (ws) {
    console.log('->> OnConnect');

    //save client in array
    socketClients.push(ws);

    //handle messsges from client
    ws.on('message', function(message,flags) {
        console.log('->> OnMessage');

        if (flags.binary == true ){
            console.log("Data is binary");
            for (key in socketClients){
                console.log("client key: " + key);
                if (key != socketClients.indexOf(ws)){
                    console.log("client key for send: " + key);
                    socketClients[key].send(message, {binary: true, mask: true});
                }
            }
        }

    });


    ws.on('close', function () {
        console.log('->> OnClose');

        //delete client from client's list
        var clientIndex = socketClients.indexOf(ws);
        delete socketClients[clientIndex];

    })

});

console.log("WEBSOCKET server running at " + addresses[0] + ": 8080");


function Client(data) {
    this.data = data;
}





