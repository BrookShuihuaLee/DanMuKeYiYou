/**
 * Created by Brook on 2016/5/21.
 */
import self from 'sdk/self';
import PAGE_WORKER from 'sdk/page-worker';
import TIMERS from 'sdk/timers';

const
    DEBUG = false,
    DEBUG_LOG = (...args) => {
        if (DEBUG) console.log(...args);
    },
    WAIT_OLD_MESSAGES_TIME = 10000;

export default new class {
    constructor() {
        DEBUG_LOG('SocketHandler::constructor() start');
        this._isConnected = false;
        this._urlToMessageListenerMap = new Map();
        this._urlToOldMessagesCBMap = new Map();

        this._page = PAGE_WORKER.Page({
            contentURL: self.data.url('./pageWorker/pageWorker.html'),
            contentScriptFile: [self.data.url('./pageWorker/SocketWorker.js')]
        });
        this._page.port.on('connect', this._connect.bind(this));
        this._page.port.on('disconnect', this._disconnect.bind(this));
        this._page.port.on('message', this._message.bind(this));
        this._page.port.on('oldMessages', this._oldMessages.bind(this));
        DEBUG_LOG('SocketHandler::constructor() end');
    }

    _connect() {
        this._isConnected = true;
    }

    _disconnect() {
        this._isConnected = false;
    }

    _message(message) {
        DEBUG_LOG(`SocketHandler::_message(${message})`);
        const listener = this._urlToMessageListenerMap.get(message.url);
        if (listener) listener(message);
    }

    _oldMessages(url, oldMessages) {
        DEBUG_LOG(`SocketHandler::getOldMessages(${[url, oldMessages]})`);
        const cb = this._urlToOldMessagesCBMap.get(url);
        if (cb) {
            cb(oldMessages);
            this._urlToOldMessagesCBMap.delete(url);
        }
    }

    setMessageListener(url, listener) {
        this._urlToMessageListenerMap.set(url, listener);
        this._page.port.emit('openUrl', url);
    }

    deleteMessageListener(url) {
        this._page.port.emit('leaveUrl', url);
        this._urlToMessageListenerMap.delete(url);
    }

    getOldMessages(url) {
        DEBUG_LOG(`SocketHandler::getOldMessages(${url})`);
        return new Promise(resolve => {
            this._page.port.emit('getOldMessages', url);
            this._urlToOldMessagesCBMap.set(url, resolve);
            TIMERS.setTimeout(() => {
                resolve([]);
                this._urlToOldMessagesCBMap.delete(url);
            }, WAIT_OLD_MESSAGES_TIME);
        }).catch(console.error);
    }

    addMessage(message) {
        this._page.port.emit('addMessage', message);
    }
};