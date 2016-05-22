/**
 * Created by Brook on 2016/5/15.
 */
const WAIT_OLD_MESSAGES_TIME = 10000;

window._SOCKET_HANDLER = new class {
    constructor() {
        this._isConnected = false;
        this._urlToMessageListenerMap = new Map();
        this._urlToOldMessagesCBMap = new Map();

        this.socket = window.io('http://danmukyy.duapp.com');
        //this.socket = window.io('http://192.168.1.144:18080');
        this.socket.on('connect', this._connect.bind(this));
        this.socket.on('disconnect', this._disconnect.bind(this));
        this.socket.on('message', this._message.bind(this));
        this.socket.on('oldMessages', this._oldMessages.bind(this));
    }

    _connect() {
        this._isConnected = true;
    }

    _disconnect() {
        this._isConnected = false;
    }

    _message(message) {
        const listener = this._urlToMessageListenerMap.get(message.url);
        if (listener) listener(message);
    }

    _oldMessages(url, oldMessages) {
        const cb = this._urlToOldMessagesCBMap.get(url);
        if (cb) {
            cb(oldMessages);
            this._urlToOldMessagesCBMap.delete(url);
        }
    }

    setMessageListener(url, listener) {
        this._urlToMessageListenerMap.set(url, listener);
        this.socket.emit('openUrl', url);
    }

    deleteMessageListener(url) {
        this.socket.emit('leaveUrl', url);
        this._urlToMessageListenerMap.delete(url);
    }

    getOldMessages(url) {
        return new Promise(resolve => {
            this.socket.emit('getOldMessages', url);
            this._urlToOldMessagesCBMap.set(url, resolve);
            window.setTimeout(() => {
                resolve();
                this._urlToOldMessagesCBMap.delete(url);
            }, WAIT_OLD_MESSAGES_TIME);
        });
    }

    addMessage(message) {
        this.socket.emit('addMessage', message);
    }
};