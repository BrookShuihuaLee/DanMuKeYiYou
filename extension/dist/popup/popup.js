'use strict';

var MESSAGE_TAG = 'popup';

document.getElementById('btn').addEventListener('click', function (e) {
    chrome.runtime.sendMessage({
        tag: MESSAGE_TAG
    });
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    console.log(message, sender);
});