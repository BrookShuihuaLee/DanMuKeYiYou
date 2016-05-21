'use strict';

/**
 * Created by Brook on 2016/5/14.
 */

var MESSAGE_TAG = 'page',
    DEBUG = false,
    DEBUG_LOG = function DEBUG_LOG() {
    var _console;

    if (DEBUG) (_console = console).log.apply(_console, arguments);
};
var uids = new Set();

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    DEBUG_LOG('收到message', message);
    if (!uids.has(message.uid)) {
        fly(message);
    }
});

function fly(message) {
    DEBUG_LOG('fly', message);
    uids.add(message.uid);
    var div = document.createElement('div');
    div.className = 'dm--bullet';
    div.style.color = message.color;
    div.style.fontSize = message.fontSize + 'px';
    div.style[message.direction] = '-10086px';
    div.innerText = message.text;

    document.body.insertBefore(div, null);

    var top = window.innerHeight - div.clientHeight;
    div.style.top = Math.random() * top + 'px';

    (function (direction, duration) {
        var startDate = new Date(),
            intervalId = setInterval(move, 1);
        function move() {
            var distance = div.clientWidth + window.innerWidth,
                time = new Date() - startDate;
            if (time > duration) {
                clearInterval(intervalId);
                div.remove();
                uids.delete(message.uid);
            } else {
                div.style[direction] = time / duration * distance - div.clientWidth + 'px';
            }
        }
    })(message.direction, 5000 + Math.random() * 5000);
}