/**
 * Created by Brook on 2016/5/21.
 */
import self from 'sdk/self';
import panel from 'sdk/panel';
import BUTTON_ACTION from 'sdk/ui/button/action';
import OPTIONS_HANDLER from './OptionsHandler.js';
import DISPLAY_HANDLER from './DisplayHandler.js';
import TABS from 'sdk/tabs';

export default new class {
    constructor() {
        this._popupPanel = panel.Panel({
            width: 315,
            height: 410,
            contentURL: self.data.url('./popup/popup.html'),
            contentScriptFile: [self.data.url('./popup/popup.js')],
            onHide: () => {
                this._isOpening = false;
            }
        });
        this._isOpening = false;
        this._popupPanel.port.on('getOptions', this._getOptions.bind(this));
        this._popupPanel.port.on('setOptions', this._setOptions.bind(this));
        this._popupPanel.port.on('getDisplay', this._getDisplay.bind(this));
        this._popupPanel.port.on('setDisplay', this._setDisplay.bind(this));
        this._popupPanel.port.on('sendMessage', this._sendMessage.bind(this));
        this._popupPanel.port.on('openAbout', this._openAbout.bind(this));
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

    _getOptions() {
        this._popupPanel.port.emit('options', OPTIONS_HANDLER.getOptions());
    }
    
    _getDisplay() {
        let display = DISPLAY_HANDLER.getOptions();
        this._popupPanel.port.emit('display', display);
        if (this._displayListener) this._displayListener(display);
    }

    setMessageListener(listener) {
        this._messageListener = listener;
    }
    
    setDisplayListener(listener) {
        this._displayListener = listener;
    }

    _sendMessage(message) {
        if (this._messageListener) this._messageListener(message);
    }

    _setOptions(options) {
        OPTIONS_HANDLER.setOptions(options);
    }
    
    _setDisplay(options) {
        DISPLAY_HANDLER.setOptions(options);
        if (this._displayListener) this._displayListener(options);
    }

    _openAbout() {
        TABS.open('http://brookshuihualee.github.io/DanMuKeYiYou/');
    }
};