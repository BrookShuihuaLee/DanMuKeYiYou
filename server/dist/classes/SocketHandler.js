'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Brook on 2016/5/14.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _DBHandler = require('./DBHandler.js');

var _DBHandler2 = _interopRequireDefault(_DBHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbHandler = new _DBHandler2.default(),
    urlToHandlersMap = new Map();

var SocketHandler = function () {
    _createClass(SocketHandler, null, [{
        key: 'init',
        value: function init(io) {
            io.on('connection', function (socket) {
                new SocketHandler(socket);
            });
        }
    }, {
        key: 'addMessage',
        value: function addMessage(message) {
            dbHandler.addMessage(message);
            var handlerSet = urlToHandlersMap.get(message.url);
            if (!handlerSet) return;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = handlerSet[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var handler = _step.value;

                    handler.sendMessage(message);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    function SocketHandler(socket) {
        _classCallCheck(this, SocketHandler);

        this.socket = socket;
        this.openingUrlSet = new Set();

        this._connect();
        socket.on('disconnect', this._disconnect.bind(this));
        socket.on('openUrl', this._openUrl.bind(this));
        socket.on('levelUrl', this._levelUrl.bind(this));
        socket.on('addMessage', this._addMessage.bind(this));
        socket.on('getOldMessages', this._getOldMessages.bind(this));
    }

    //接收事件

    _createClass(SocketHandler, [{
        key: '_connect',
        value: function _connect() {
            console.log(this.socket.id + ' connect');
        }
    }, {
        key: '_openUrl',
        value: function _openUrl(url) {
            var handlerSet = urlToHandlersMap.get(url);
            if (!handlerSet) urlToHandlersMap.set(url, handlerSet = new Set());
            handlerSet.add(this);
            this.openingUrlSet.add(url);
        }
    }, {
        key: '_levelUrl',
        value: function _levelUrl(url) {
            var handlerSet = urlToHandlersMap.get(url);
            if (!handlerSet) return;
            handlerSet.delete(this);
            if (!handlerSet.size) urlToHandlersMap.delete(url);
            this.openingUrlSet.delete(url);
        }
    }, {
        key: '_disconnect',
        value: function _disconnect() {
            console.log(this.socket.id + ' disconnect');
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.openingUrlSet[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var url = _step2.value;

                    this._levelUrl(url);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: '_addMessage',
        value: function _addMessage() {
            var message = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            SocketHandler.addMessage(message);
        }
    }, {
        key: '_getOldMessages',
        value: function _getOldMessages(url) {
            this.sendOldMessages(dbHandler.getOldMessages(url));
        }

        //发送事件

    }, {
        key: 'sendMessage',
        value: function sendMessage(message) {
            this.socket.emit('message', message);
        }
    }, {
        key: 'sendOldMessages',
        value: function sendOldMessages(oldMessages) {
            this.socket.emit('oldMessages', oldMessages);
        }
    }]);

    return SocketHandler;
}();

exports.default = SocketHandler;
;