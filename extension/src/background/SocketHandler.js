/**
 * Created by Brook on 2016/5/15.
 */
const WAIT_OLD_MESSAGES_TIME = 10000;

window._SOCKET_HANDLER = new class {
    constructor() {
        this.isConnected = false;
        this.urlToMessageListenerMap = new Map();
        this.urlToOldMessagesCBMap = new Map();

        this.socket = window.io('http://192.168.1.144:15434');
        this.socket.on('connect', this._connect.bind(this));
        this.socket.on('disconnect', this._disconnect.bind(this));
        this.socket.on('message', this._message.bind(this));
        this.socket.on('oldMessages', this._oldMessages.bind(this));
    }

    _connect() {
        this.isConnected = true;
    }

    _disconnect() {
        this.isConnected = false;
    }

    _message(message) {
        const listener = this.urlToMessageListenerMap.get(message.url);
        if (listener) listener(message);
    }

    _oldMessages(url, oldMessages) {
        const cb = this.urlToOldMessagesCBMap.get(url);
        if (cb) {
            cb(oldMessages);
            this.urlToOldMessagesCBMap.delete(url);
        }
    }

    setMessageListener(url, listener) {
        this.urlToMessageListenerMap.set(url, listener);
        this.socket.emit('openUrl', url);
    }

    deleteMessageListener(url) {
        this.socket.emit('leaveUrl', url);
        this.urlToMessageListenerMap.delete(url);
    }

    getOldMessages(url) {
        return new Promise(resolve => {
            this.socket.emit('getOldMessages', url);
            this.urlToOldMessagesCBMap.set(url, resolve);
            window.setTimeout(() => {
                resolve();
                this.urlToOldMessagesCBMap.delete(url);
            }, WAIT_OLD_MESSAGES_TIME);
        });
    }

    addMessage(message) {
        this.socket.emit('addMessage', message);
    }
};