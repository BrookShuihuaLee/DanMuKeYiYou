/**
 * Created by Brook on 2016/5/21.
 */
import SIMPLE_STORAGE from 'sdk/simple-storage';

export default new class {
    constructor() {
        SIMPLE_STORAGE.storage.options = SIMPLE_STORAGE.storage.options || {
                enable: true,
                color: 'rgb(0, 0, 0)',
                fontSize: '60',
                direction: 'right'
            };
    }

    getOptions() {
        return SIMPLE_STORAGE.storage.options;
    }

    setOptions(options) {
        if (this._optionsChangeListener) {
            this._optionsChangeListener(options);
        }
        SIMPLE_STORAGE.storage.options = options;
    }

    setOptionsChangeListener(listener) {
        this._optionsChangeListener = listener;
    }
};