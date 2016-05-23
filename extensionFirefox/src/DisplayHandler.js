/**
 * Created by Brook on 2016/5/21.
 */
import SIMPLE_STORAGE from 'sdk/simple-storage';

export default new class {
    constructor() {
        SIMPLE_STORAGE.storage.display = SIMPLE_STORAGE.storage.display || {
                scale: '1',
                family: '',
                alpha: '1',
                time: '1'
            };
    }

    getOptions() {
        return SIMPLE_STORAGE.storage.display;
    }

    setOptions(options) {
        if (this._optionsChangeListener) {
            this._optionsChangeListener(options);
        }
        SIMPLE_STORAGE.storage.display = options;
    }

    setOptionsChangeListener(listener) {
        this._optionsChangeListener = listener;
    }
};