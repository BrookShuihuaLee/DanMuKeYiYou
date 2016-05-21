/**
 * Created by Brook on 2016/5/14.
 */
const
    urlToTabIdsMap = new Map(),
    tabIdToUrl = new Map(),
    urlMessages = new Map(),
    urlClears = new Map(),
    MESSAGE_TAG = 'background',
    MESSAGE_MAX_COUNT = 200;

let options = {};

function uid() {
    return parseInt(Math.random() * 0xffffffff);
}

function getOptions() {
    window._OPTIONS_HANDLER.getOptions().then(res => {
        options = res;
        chrome.runtime.sendMessage({
            tag: MESSAGE_TAG,
            event: 'options',
            options
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
        let url = tabIdToUrl.get(tabId);
        if (urlToTabIdsMap.has(url)) {
            urlToTabIdsMap.get(url).delete(tabId);
            if (urlToTabIdsMap.get(url).size === 0) {
                window._SOCKET_HANDLER.deleteMessageListener(url);
                urlToTabIdsMap.delete(url);
                let intervalId = urlClears.get(url);
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
        window._SOCKET_HANDLER.setMessageListener(url, msg => {
            addMessageToOld(msg);
        });
        urlMessages.set(url, []);
        window._SOCKET_HANDLER.getOldMessages(url).then(ms => {
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

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.tag === MESSAGE_TAG) return;
    if (message.tag === 'popup') {
        if (message.event === 'loaded') {
            getOptions();
        } else if (message.event === 'options') {
            saveOptions(message.options);
        } else {
            delete message['tag'];
            let tabId = message.tabId;
            delete message.tabId;
            if (!tabIdToUrl.has(tabId)) {
                chrome.tabs.reload();
            } else {
                //console.log('收到来自popup的message', message);
                addMessageToOld(message);
            }
            window._SOCKET_HANDLER.addMessage(message)
        }
    } else { // page
        const
            url = sender.tab.url,
            tabId = sender.tab.id;
        updateTab(tabId, url);
    }
});

chrome.tabs.onRemoved.addListener(removeTab);

setInterval(() => {
    if (options.enable) {
        chrome.tabs.query({active: true}, tabs => {
            tabs.forEach(tab => {
                if (!tabIdToUrl.has(tab.id) || !urlMessages.has(tab.url)) {
                    return;
                }
                //console.log(urlMessages.get(tab.url).map((message) => message.text).join('=>'));
                let message = urlMessages.get(tab.url).shift();
                if (message) {
                    if (!message.uid) {
                        message.uid = uid();
                    }
                    chrome.tabs.sendMessage(tab.id, message);
                    urlMessages.get(tab.url).push(message);
                }
            })
        })
    }
}, 1000);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateTab(tabId, tab.url);
    }
})