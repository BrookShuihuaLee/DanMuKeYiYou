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
        this._urlToTabsMap = new Map();
        this._tabToPortMap = new Map();
        PAGE_MOD.PageMod({
            include: ['http://*', 'https://*'],
            contentScriptFile: [self.data.url('./contentScripts/danMuKeYiYou.js')],
            contentStyleFile: [self.data.url('./contentScripts/danMuKeYiYou.css')],
            onAttach: this._onAttach.bind(this)
        });
        this._startFlyThread();
    }

    _onAttach(worker) {
        this._addTab(worker.tab, worker.port);
        worker.on('detach', () => {
            this._removeTab(worker.tab);
        })
    }

    _addTab(tab, port) {
        const url = tab.url;
        this._tabToPortMap.set(tab, port);
    }

    _removeTab(tab) {
        const url = tab.url;
        this._tabToPortMap.delete(tab);
    }

    _getPortByTab(tab) {
        const tabToPortMap = this._urlToTabsMap.get(tab.url);
    }

    _getTopMessageBy(url) {
        const messages = this._urlToMessagesMap.get(url);
        if (messages) {
            const message = messages.unshift();
            if (message) {
                messages.push(message);
                return message;
            }
        }
    }

    _startFlyThread() {
        TIMERS.setInterval(() => {
            if (!this._enable) return;
            const
                tab = TABS.activeTab,
                port = this._getPortByTab(tab);
            if (port) {
                const message = this._getTopMessageBy(tab.url);
                if (message) {
                    try {
                        port.emit('fly', message);
                    } catch (e) {
                        this._removeTab(tab);
                    }
                }
            }
        }, FLY_FREQUENCY);
    }
};

TIMERS.setInterval(() => {
    console.log(TABS.activeTab.title, TABS.activeTab.url, TABS.activeTab.id);
}, 1000);