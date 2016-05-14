/**
 * Created by Brook on 2016/5/14.
 */
const
    config = require('./config.js'),
    http = require('http'),
    server = http.createServer(),
    io = require('socket.io')(server),
    SocketHandler = require('./classes/SocketHandler.js');

SocketHandler.init(io);

server.listen(config.port, () => {
    console.log(`listening on *:${config.port}`);
});