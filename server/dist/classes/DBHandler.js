'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Brook on 2016/5/14.
 */

var _class = function () {
    function _class() {
        //TO DO

        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'addMessage',
        value: function addMessage(message) {}
    }, {
        key: 'getOldMessages',
        value: function getOldMessages(url) {
            return Array(5).fill({
                text: 'asdf',
                url: 'jhaha'
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
;