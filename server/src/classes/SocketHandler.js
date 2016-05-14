/**
 * Created by Brook on 2016/5/14.
 */
import DBHandler from './DBHandler.js';
import Message from './Message.js';

const
    dbHandler = new DBHandler(),
    urlToHandlersMap = new Map();

export default class SocketHandler {

    static init(io) {
        io.on('connection', (socket) => {
            new SocketHandler(socket);
        });
    }

    static addMessage(message, fromHandler) {
        dbHandler.addMessage(message);
        let handlerSet = urlToHandlersMap.get(message.url);
        if (!handlerSet) return;
        for (let handler of handlerSet) {
            if (handler === fromHandler) continue;
            handler.sendMessage(message);
        }
    }

    constructor(socket) {
        this.socket = socket;
        this.openingUrlSet = new Set();

        this._connect();
        socket.on('disconnect', this._disconnect.bind(this));
        socket.on('openUrl', this._openUrl.bind(this));
        socket.on('leaveUrl', this._leaveUrl.bind(this));
        socket.on('addMessage', this._addMessage.bind(this));
        socket.on('getOldMessages', this._getOldMessages.bind(this));
    }

    //接收事件

    _connect() {
        console.log(`${this.socket.id} connect`);
    }

    _openUrl(url) {
        let handlerSet = urlToHandlersMap.get(url);
        if (!handlerSet) urlToHandlersMap.set(url, handlerSet = new Set());
        handlerSet.add(this);
        this.openingUrlSet.add(url);
    }

    _leaveUrl(url) {
        let handlerSet = urlToHandlersMap.get(url);
        if (!handlerSet) return;
        handlerSet.delete(this);
        if (!handlerSet.size) urlToHandlersMap.delete(url);
        this.openingUrlSet.delete(url);
    }

    _disconnect() {
        console.log(`${this.socket.id} disconnect`);
        for (let url of this.openingUrlSet) {
            this._leaveUrl(url);
        }
    }

    _addMessage(message) {
        if (message && Message._validateObject(message))
            SocketHandler.addMessage(message, this);
    }

    _getOldMessages(url) {
        dbHandler.getOldMessages(url)
            .then(this.sendOldMessages.bind(this))
            .catch(console.log);
    }

    //发送事件

    sendMessage(message) {
        this.socket.emit('message', message);
    }

    sendOldMessages(oldMessages) {
        this.socket.emit('oldMessages', oldMessages);
    }
}