/**
 * Created by Brook on 2016/5/14.
 */
import config from './config.js';
import http from 'http';
import socketIO from 'socket.io';
import SocketHandler from './classes/SocketHandler.js';

const
    server = http.createServer(),
    io = socketIO(server);

SocketHandler.init(io);

server.listen(config.PORT, () => {
    console.log(`listening on *:${config.PORT}`);
});