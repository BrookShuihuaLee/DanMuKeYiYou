/**
 * Created by Brook on 2016/5/15.
 */
const WAIT_OPTIONS_TIME = 10;

window._DISPLAY_HANDLER = new class {
    constructor() {
        this._getOptionsFromChrome();
        chrome.storage.onChanged.addListener(this._getOptionsFromChrome.bind(this));
    }

    _getOptionsFromChrome() {
        chrome.storage.sync.get({
            scale: '1',
            family: '',
            alpha: '1',
            speed: '1'
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