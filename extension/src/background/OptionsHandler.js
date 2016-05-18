/**
 * Created by Brook on 2016/5/15.
 */
const WAIT_OPTIONS_TIME = 10;

window._OPTIONS_HANDLER = new class {
    constructor() {
        this._getOptionsFromChrome();
        chrome.storage.onChanged.addListener(this._getOptionsFromChrome.bind(this));
    }

    _getOptionsFromChrome() {
        chrome.storage.sync.get({
            enable: true,

            color: 'rgb(0, 0, 0)',
            fontSize: '60',
            direction: 'right'
        }, options => {
            this.options = options;
        });
    }

    _setOptionsToChrome(options) {
        chrome.storage.sync.set(options);
    }

    getOptions() {
        return new Promise(resolve => {
            let check = () => {
                if (this.options) resolve(this.options);
                else window.setTimeout(check, WAIT_OPTIONS_TIME);
            };
            check();
        });
    }

    setOptions(options) {
        this._setOptionsToChrome(this.options = options);
    }
};