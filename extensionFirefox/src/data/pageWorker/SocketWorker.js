/**
 * Created by Brook on 2016/5/21.
 */
const
    MESSAGE_TAG = 'SocketWorker',
    DEBUG = false,
    DEBUG_LOG = (...args) => {
        if (DEBUG) console.log(...args);
    };

new class {
    constructor() {
        window.addEventListener('message', ({data}) => {
            DEBUG_LOG(`SocketWorker::constructor() receive message`, data);
            if (data.tag === MESSAGE_TAG || !data.args) return;
            self.port.emit(...data.args);
        });
        self.port.on('openUrl', this._sendMessageToPageWorker.bind(this, 'openUrl'));
        self.port.on('leaveUrl', this._sendMessageToPageWorker.bind(this, 'leaveUrl'));
        self.port.on('getOldMessages', this._sendMessageToPageWorker.bind(this, 'getOldMessages'));
        self.port.on('addMessage', this._sendMessageToPageWorker.bind(this, 'addMessage'));
    }

    _sendMessageToPageWorker(...args) {
        DEBUG_LOG(`SocketWorker::_sendMessageToPageWorker(${args})`);
        window.postMessage({
            tag: MESSAGE_TAG,
            args
        }, window.location);
    }
};