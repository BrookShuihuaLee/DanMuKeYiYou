'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Brook on 2016/5/15.
 */
var WAIT_OPTIONS_TIME = 10;

window._OPTIONS_HANDLER = new (function () {
    function _class() {
        _classCallCheck(this, _class);

        this._getOptionsFromChrome();
        chrome.storage.onChanged.addListener(this._getOptionsFromChrome.bind(this));
    }

    _createClass(_class, [{
        key: '_getOptionsFromChrome',
        value: function _getOptionsFromChrome() {
            var _this = this;

            chrome.storage.sync.get({
                enable: true,

                color: 'rgb(0, 0, 0)',
                fontSize: '60',
                direction: 'right'
            }, function (options) {
                _this.options = options;
            });
        }
    }, {
        key: '_setOptionsToChrome',
        value: function _setOptionsToChrome(options) {
            chrome.storage.sync.set(options);
        }
    }, {
        key: 'getOptions',
        value: function getOptions() {
            var _this2 = this;

            return new Promise(function (resolve) {
                var check = function check() {
                    if (_this2.options) resolve(_this2.options);else window.setTimeout(check, WAIT_OPTIONS_TIME);
                };
                check();
            });
        }
    }, {
        key: 'setOptions',
        value: function setOptions(options) {
            this._setOptionsToChrome(this.options = options);
        }
    }]);

    return _class;
}())();