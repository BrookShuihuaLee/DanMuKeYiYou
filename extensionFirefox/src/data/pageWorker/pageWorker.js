/**
 * Created by Brook on 2016/5/21.
 */
const MESSAGE_TAG = 'PageWorker';

new class {
    constructor() {
        this._socket = window.io('http://danmukyy.duapp.com/');
        window.addEventListener('message', ({data}) => {
            if (data.tag === MESSAGE_TAG || !data.args) return;
            this._socket.emit(...data.args);
        });
        this._socket.on('connect', this._sendMessageToSocketWorker.bind(this, 'connect'));
        this._socket.on('disconnect', this._sendMessageToSocketWorker.bind(this, 'disconnect'));
        this._socket.on('message', this._sendMessageToSocketWorker.bind(this, 'message'));
        this._socket.on('oldMessages', this._sendMessageToSocketWorker.bind(this, 'oldMessages'));
    }

    _sendMessageToSocketWorker(...args) {
        window.postMessage({
            tag: MESSAGE_TAG,
            args
        }, window.location);
    }
};