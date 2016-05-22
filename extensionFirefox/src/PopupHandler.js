/**
 * Created by Brook on 2016/5/21.
 */
import self from 'sdk/self';
import panel from 'sdk/panel';
import BUTTON_ACTION from 'sdk/ui/button/action';
import OPTIONS_HANDLER from './OptionsHandler.js';

export default new class {
    constructor() {
        this._popupPanel = panel.Panel({
            contentURL: self.data.url('./popup/popup.html'),
            contentScriptFile: [self.data.url('./popup/popup.js')],
            onHide: () => {
                this._isOpening = false;
            }
        });
        this._isOpening = false;
        this._popupPanel.port.on('getOptions', this.getOptions.bind(this));
        this._button = BUTTON_ACTION.ActionButton({
            id: 'danmukyy',
            label: '弹幕可以有',
            icon: {
                '16': './images/icon.png',
                '32': './images/icon.png',
                '64': './images/icon.png'
            },
            onClick: (state) => {
                if (!this._isOpening) {
                    this._isOpening = true;
                    this._popupPanel.show({
                        position: this._button
                    });
                }
            }
        });
    }

    getOptions() {
        this._popupPanel.port.emit('options', OPTIONS_HANDLER.getOptions());
    }
};