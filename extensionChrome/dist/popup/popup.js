'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

document.getElementById('about').addEventListener('click', function () {
    window.open('http://brookshuihualee.github.io/DanMuKeYiYou/');
});

var MESSAGE_TAG = 'popup',
    DEBUG = true,
    DEBUG_LOG = function DEBUG_LOG() {
    var _console;

    if (DEBUG) (_console = console).log.apply(_console, arguments);
};

var color = '#000';
var fontSize = '48';
var direction = 'right';
var enable = true;

function saveOptions() {
    chrome.runtime.sendMessage({
        tag: MESSAGE_TAG,
        event: 'options',
        options: {
            color: color,
            fontSize: fontSize,
            direction: direction,
            enable: enable
        }
    });
    renderOptions();
}

var remainText = 15;
function setTextNum(n) {
    n = n || remainText;
    var current = document.getElementById('content').value.trim().length;
    n -= current;
    document.getElementById('content-length').innerText = n;
    if (n < 0) {
        document.getElementById('content').style.color = 'red';
    } else {
        document.getElementById('content').style.color = '#000';
    }
}

document.getElementById('size').addEventListener('click', function (e) {
    if (e.target === document.getElementById('size')) {
        return;
    }
    var t = e.target;
    fontSize = t.attributes.value.value;
    saveOptions();
});

document.getElementById('direction').addEventListener('click', function (e) {
    if (e.target === document.getElementById('direction')) {
        return;
    }
    var t = e.target;
    direction = t.attributes.value.value;
    saveOptions();
});

document.getElementById('colors').addEventListener('click', function (e) {
    if (e.target === document.getElementById('colors')) {
        return;
    }
    var t = e.target;
    if (t.nodeName === 'DIV') {
        t = t.children[0];
    }
    color = t.style.backgroundColor;
    saveOptions();
});

function sendMessage() {
    enable = true;
    saveOptions();
    var text = document.getElementById('content').value.trim();
    text = text.replace('\n', '');
    if (text && text.length <= remainText) {
        document.getElementById('content').value = '';
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            chrome.runtime.sendMessage({
                tag: MESSAGE_TAG,
                text: text,
                direction: direction,
                color: color,
                fontSize: fontSize,
                url: tab.url,
                tabId: tab.id
            });
        });
        setTextNum();
    }
}

document.getElementById('content').addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        sendMessage();
    } else {
        setTextNum();
    }
});

document.getElementById('btn').addEventListener('click', function (e) {
    sendMessage();
});

document.getElementById('enable-toggle').addEventListener('click', function (e) {
    enable = !enable;
    saveOptions();
});

function renderOptions() {
    [].concat(_toConsumableArray(document.getElementById('size').children)).forEach(function (e) {
        DEBUG_LOG(e.attributes.value.value, 'color', fontSize);
        if (e.attributes.value.value === fontSize) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });

    [].concat(_toConsumableArray(document.getElementById('direction').children)).forEach(function (e) {
        if (e.attributes.value.value === direction) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });

    [].concat(_toConsumableArray(document.getElementById('colors').children)).forEach(function (e) {
        DEBUG_LOG(e.children[0].style.backgroundColor, 'color', color);
        if (e.children[0].style.backgroundColor === color) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });

    document.getElementById('enable-toggle').innerText = enable ? '关' : '开';

    switch (fontSize) {
        case '48':
            setTextNum(20);
            remainText = 20;
            break;
        case '60':
            setTextNum(15);
            remainText = 15;
            break;
        case '72':
            setTextNum(10);
            remainText = 10;
            break;
        default:
            setTextNum(15);
            remainText = 15;
    }
}

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.event === 'options') {
        var _message$options = message.options;
        enable = _message$options.enable;
        color = _message$options.color;
        fontSize = _message$options.fontSize;
        direction = _message$options.direction;

        renderOptions();
    }
    console.log(message, sender);
});

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG,
    event: 'loaded'
});