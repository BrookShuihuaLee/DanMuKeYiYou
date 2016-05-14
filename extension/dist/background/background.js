'use strict';

/**
 * Created by Brook on 2016/5/14.
 */
var socket = io('http://localhost:15434'),
    urlToTabIdsMap = new Map(),
    MESSAGE_TAG = 'background';

var isConected = false;

socket.on('connect', function () {
    isConected = true;
});

socket.on('disconnect', function () {
    isConected = false;
});

socket.on('message', function (message) {
    console.log(message);
});
socket.on('oldMessages', function (oldMessages) {
    console.log(oldMessages);
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.tag === MESSAGE_TAG) return;
    //const
    //    url = sender.tab.url,
    //    tabId = sender.tab.id,
    //    tabIdSet = urlToTabIdsMap.get(url);
    console.log(message, sender);
});