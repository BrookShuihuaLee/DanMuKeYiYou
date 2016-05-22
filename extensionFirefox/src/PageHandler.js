/**
 * Created by Brook on 2016/5/22.
 */
import self from 'sdk/self';
import PAGE_MOD from 'sdk/page-mod';
import TABS from 'sdk/tabs';
import TIMERS from 'sdk/timers';
import POPUP_HANDLER from './PopupHandler.js';
import SOCKET_HANDLER from './SocketHandler.js';
import OPTIONS_HANDLER from './OptionsHandler.js';

const FLY_FREQUENCY = 1000;

export default new class {
    constructor() {
        this._enable = true;
        OPTIONS_HANDLER.setOptionsChangeListener(options => {
            this._enable = options.enable;
        });
        this._urlToMessagesMap = new Map();
        this._urlToTabIdsMap = new Map();
        this._tabIdToUrlMap = new Map();
        this._tabIdToPortMap = new Map();
        PAGE_MOD.PageMod({
            include: ['http://*', 'https://*'],
            contentScriptWhen: 'ready',
            contentScriptFile: [self.data.url('./contentScripts/danMuKeYiYou.js')],
            contentStyleFile: [self.data.url('./contentScripts/danMuKeYiYou.css')],
            onAttach: this._onAttach.bind(this)
        });
        this._startFlyThread();
        POPUP_HANDLER.setMessageListener(this._sendMessage.bind(this));
    }

    _onAttach(worker) {
        this._addTab(worker.tab.id, worker.tab.url, worker.port);
        worker.on('detach', () => {
            this._removeTabId(worker.tab.id);
        })
    }

    _addTab(tabId, url, port) {
        this._removeTabId(tabId);
        this._tabIdToUrlMap.set(tabId, url);
        let tabIdSet = this._urlToTabIdsMap.get(url);
        if (!tabIdSet) {
            this._urlToTabIdsMap.set(url, tabIdSet = new Set());
            this._urlToMessagesMap.set(url, []);
            SOCKET_HANDLER.getOldMessages(url).then(oldMessages => {
                const messages = this._urlToMessagesMap.get(url);
                if (messages) {
                    this._urlToMessagesMap.set(url, messages.concat(oldMessages));
                }
            });
            SOCKET_HANDLER.setMessageListener(url, message => {
                const messages = this._urlToMessagesMap.get(url);
                if (messages) {
                    messages.unshift(message);
                }
            });
        }
        tabIdSet.add(tabId);
        this._tabIdToPortMap.set(tabId, port);
    }

    _removeTabId(tabId) {
        const url = this._tabIdToUrlMap.get(tabId);
        if (url) {
            this._tabIdToUrlMap.delete(tabId);
            const tabIdSet = this._urlToTabIdsMap.get(url);
            tabIdSet.delete(tabId);
            if (!tabIdSet.size) {
                this._urlToTabIdsMap.delete(url);
                this._urlToMessagesMap.delete(url);
                SOCKET_HANDLER.deleteMessageListener(url);
            }
        }
        this._tabIdToPortMap.delete(tabId);
    }

    _uid() {
        return parseInt(Math.random() * 0xffffffff);
    }

    _getTopMessageByUrl(url) {
        const messages = this._urlToMessagesMap.get(url);
        if (messages) {
            const message = messages.shift();
            if (message) {
                messages.push(message);
                if (!message.uid) {
                    message.uid = this._uid();
                }
                return message;
            }
        }
    }

    _startFlyThread() {
        TIMERS.setInterval(() => {
            if (!this._enable) return;
            let tabId = TABS.activeTab.id,
                url = this._tabIdToUrlMap.get(tabId),
                port = this._tabIdToPortMap.get(tabId);
            if (port) {
                if (url !== TABS.activeTab.url) {
                    this._removeTabId(tabId);
                    this._addTab(tabId, url = TABS.activeTab.url, port);
                }
                const message = this._getTopMessageByUrl(url);
                if (message) {
                    try {
                        port.emit('fly', message);
                    } catch (e) {
                        console.error(e);
                        this._removeTabId(tabId);
                    }
                }
            }
        }, FLY_FREQUENCY);
    }

    _sendMessage(message) {
        const
            {id: tabId, url} = TABS.activeTab,
            messages = this._urlToMessagesMap.get(url);
        if (tabId && url && messages) {
            message.url = url;
            messages.unshift(message);
            SOCKET_HANDLER.addMessage(message);
        }
    }
};