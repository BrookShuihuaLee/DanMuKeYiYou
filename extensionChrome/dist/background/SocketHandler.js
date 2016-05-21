'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Brook on 2016/5/15.
 */
var WAIT_OLD_MESSAGES_TIME = 10000;

window._SOCKET_HANDLER = new (function () {
    function _class() {
        _classCallCheck(this, _class);

        this.isConnected = false;
        this.urlToMessageListenerMap = new Map();
        this.urlToOldMessagesCBMap = new Map();

        this.socket = window.io('http://danmukyy.duapp.com');
        //this.socket = window.io('http://192.168.1.144:18080');
        this.socket.on('connect', this._connect.bind(this));
        this.socket.on('disconnect', this._disconnect.bind(this));
        this.socket.on('message', this._message.bind(this));
        this.socket.on('oldMessages', this._oldMessages.bind(this));
    }

    _createClass(_class, [{
        key: '_connect',
        value: function _connect() {
            this.isConnected = true;
        }
    }, {
        key: '_disconnect',
        value: function _disconnect() {
            this.isConnected = false;
        }
    }, {
        key: '_message',
        value: function _message(message) {
            var listener = this.urlToMessageListenerMap.get(message.url);
            if (listener) listener(message);
        }
    }, {
        key: '_oldMessages',
        value: function _oldMessages(url, oldMessages) {
            var cb = this.urlToOldMessagesCBMap.get(url);
            if (cb) {
                cb(oldMessages);
                this.urlToOldMessagesCBMap.delete(url);
            }
        }
    }, {
        key: 'setMessageListener',
        value: function setMessageListener(url, listener) {
            this.urlToMessageListenerMap.set(url, listener);
            this.socket.emit('openUrl', url);
        }
    }, {
        key: 'deleteMessageListener',
        value: function deleteMessageListener(url) {
            this.socket.emit('leaveUrl', url);
            this.urlToMessageListenerMap.delete(url);
        }
    }, {
        key: 'getOldMessages',
        value: function getOldMessages(url) {
            var _this = this;

            return new Promise(function (resolve) {
                _this.socket.emit('getOldMessages', url);
                _this.urlToOldMessagesCBMap.set(url, resolve);
                window.setTimeout(function () {
                    resolve();
                    _this.urlToOldMessagesCBMap.delete(url);
                }, WAIT_OLD_MESSAGES_TIME);
            });
        }
    }, {
        key: 'addMessage',
        value: function addMessage(message) {
            this.socket.emit('addMessage', message);
        }
    }]);

    return _class;
}())();