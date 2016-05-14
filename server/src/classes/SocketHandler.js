/**
 * Created by Brook on 2016/5/14.
 */
import DBHandler from './DBHandler.js';
const
    dbHandler = new DBHandler(),
    urlToHandlersMap = new Map();

export default class SocketHandler {

    static init(io) {
        io.on('connection', (socket) => {
            new SocketHandler(socket);
        });
    }

    static addMessage(message) {
        dbHandler.addMessage(message);
        let handlerSet = urlToHandlersMap.get(message.url);
        if (!handlerSet) return;
        for (let handler of handlerSet) {
            handler.sendMessage(message);
        }
    }

    constructor(socket) {
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

    _connect() {
        console.log(`${this.socket.id} connect`);
    }

    _openUrl(url) {
        let handlerSet = urlToHandlersMap.get(url);
        if (!handlerSet) urlToHandlersMap.set(url, handlerSet = new Set());
        handlerSet.add(this);
        this.openingUrlSet.add(url);
    }

    _levelUrl(url) {
        let handlerSet = urlToHandlersMap.get(url);
        if (!handlerSet) return;
        handlerSet.delete(this);
        if (!handlerSet.size) urlToHandlersMap.delete(url);
        this.openingUrlSet.delete(url);
    }

    _disconnect() {
        console.log(`${this.socket.id} disconnect`);
        for (let url of this.openingUrlSet) {
            this._levelUrl(url);
        }
    }

    _addMessage(message = {}) {
        SocketHandler.addMessage(message);
    }

    _getOldMessages(url) {
        this.sendOldMessages(dbHandler.getOldMessages(url));
    }

    //发送事件

    sendMessage(message) {
        this.socket.emit('message', message);
    }

    sendOldMessages(oldMessages) {
        this.socket.emit('oldMessages', oldMessages);
    }
};