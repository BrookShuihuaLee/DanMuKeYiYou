'use strict';

var _config = require('./config.js');

var _config2 = _interopRequireDefault(_config);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _SocketHandler = require('./classes/SocketHandler.js');

var _SocketHandler2 = _interopRequireDefault(_SocketHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Brook on 2016/5/14.
 */


var server = _http2.default.createServer(),
    io = (0, _socket2.default)(server);

_SocketHandler2.default.init(io);

server.listen(_config2.default.port, function () {
    console.log('listening on *:' + _config2.default.port);
});