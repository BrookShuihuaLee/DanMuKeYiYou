/**
 * Created by Brook on 2016/5/14.
 */
import RECORDER from './classes/Recorder.js';
import config from './config.js';
import http from 'http';
import socketIO from 'socket.io';
import SocketHandler from './classes/SocketHandler.js';

const
    server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        var body = `
            <html>
                <head>
                    <meta charset="utf-8">
                </head>
                <body>${RECORDER.toString()}</body>
            </html>
            `;
        res.write(body);
        res.end();
    }),
    io = socketIO(server);

SocketHandler.init(io);

server.listen(config.PORT, () => {
    console.log(`listening on *:${config.PORT}`);
});