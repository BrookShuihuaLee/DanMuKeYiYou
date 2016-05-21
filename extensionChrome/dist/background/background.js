'use strict';

/**
 * Created by Brook on 2016/5/14.
 */
var urlToTabIdsMap = new Map(),
    tabIdToUrl = new Map(),
    urlMessages = new Map(),
    urlClears = new Map(),
    MESSAGE_TAG = 'background',
    MESSAGE_MAX_COUNT = 200;

var options = {};

function uid() {
    return parseInt(Math.random() * 0xffffffff);
}

function getOptions() {
    window._OPTIONS_HANDLER.getOptions().then(function (res) {
        options = res;
        chrome.runtime.sendMessage({
            tag: MESSAGE_TAG,
            event: 'options',
            options: options
        });
    });
}
getOptions();
function saveOptions(opts) {
    options = opts;
    window._OPTIONS_HANDLER.setOptions(options);
}

function removeTab(tabId) {
    if (tabIdToUrl.has(tabId)) {
        var url = tabIdToUrl.get(tabId);
        if (urlToTabIdsMap.has(url)) {
            urlToTabIdsMap.get(url).delete(tabId);
            if (urlToTabIdsMap.get(url).size === 0) {
                window._SOCKET_HANDLER.deleteMessageListener(url);
                urlToTabIdsMap.delete(url);
                var intervalId = urlClears.get(url);
                clearInterval(intervalId);
                urlClears.delete(url);
                urlMessages.delete(url);
            }
        }
    }
}

function addMessageToOld(msg) {
    if (urlMessages.get(msg.url)) {
        urlMessages.get(msg.url).unshift(msg);
        if (urlMessages.get(msg.url).length > MESSAGE_MAX_COUNT) {
            urlMessages.get(msg.url).length = MESSAGE_MAX_COUNT;
        }
    } else {
        window._SOCKET_HANDLER.deleteMessageListener(msg.url);
    }
}

function updateTab(tabId, url) {
    removeTab(tabId);
    tabIdToUrl.set(tabId, url);
    if (!urlToTabIdsMap.has(url)) {
        window._SOCKET_HANDLER.setMessageListener(url, function (msg) {
            addMessageToOld(msg);
        });
        urlMessages.set(url, []);
        window._SOCKET_HANDLER.getOldMessages(url).then(function (ms) {
            if (urlMessages.has(url)) {
                if (ms) {
                    urlMessages.set(url, urlMessages.get(url).concat(ms));
                    if (urlMessages.get(url).length > MESSAGE_MAX_COUNT) {
                        urlMessages.get(url).length = MESSAGE_MAX_COUNT;
                    }
                }
            }
        });
        urlToTabIdsMap.set(url, new Set());
    }
    urlToTabIdsMap.get(url).add(tabId);
}

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.tag === MESSAGE_TAG) return;
    if (message.tag === 'popup') {
        if (message.event === 'loaded') {
            getOptions();
        } else if (message.event === 'options') {
            saveOptions(message.options);
        } else {
            delete message['tag'];
            var tabId = message.tabId;
            delete message.tabId;
            if (!tabIdToUrl.has(tabId)) {
                chrome.tabs.reload();
            } else {
                //console.log('收到来自popup的message', message);
                addMessageToOld(message);
            }
            window._SOCKET_HANDLER.addMessage(message);
        }
    } else {
        // page
        var url = sender.tab.url,
            _tabId = sender.tab.id;
        updateTab(_tabId, url);
    }
});

chrome.tabs.onRemoved.addListener(removeTab);

setInterval(function () {
    if (options.enable) {
        chrome.tabs.query({ active: true }, function (tabs) {
            tabs.forEach(function (tab) {
                if (!tabIdToUrl.has(tab.id) || !urlMessages.has(tab.url)) {
                    return;
                }
                //console.log(urlMessages.get(tab.url).map((message) => message.text).join('=>'));
                var message = urlMessages.get(tab.url).shift();
                if (message) {
                    if (!message.uid) {
                        message.uid = uid();
                    }
                    chrome.tabs.sendMessage(tab.id, message);
                    urlMessages.get(tab.url).push(message);
                }
            });
        });
    }
}, 1000);

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        updateTab(tabId, tab.url);
    }
});