/**
 * Created by Brook on 2016/5/14.
 */
const
    urlToTabIdsMap = new Map(),
    tabIdToUrl = new Map(),
    urlMessages = new Map(),
    urlClears = new Map(),
    MESSAGE_TAG = 'background';

function removeTab(tabId) {
    if (tabIdToUrl.has(tabId)) {
        let url = tabIdToUrl.get(tabId);
        if (urlToTabIdsMap.has(url)) {
            urlToTabIdsMap.get(url).delete(tabId);
            if (urlToTabIdsMap.get(url).size === 0) {
                window._SOCKET_HANDLER.leaveUrl(url);
                urlToTabIdsMap.delete(url);
                let intervalId = urlClears.get(url);
                clearInterval(intervalId);
                urlClears.delete(url);
                urlMessages.delete(url);
            }
        }
    }
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.tag === MESSAGE_TAG) return;
    if (message.tag === 'popup') {       
        delete message['tag'];
        sendOneMessageToTab(message, msg => {
            window._SOCKET_HANDLER.addMessage(msg)
            urlMessages.get(msg.url).add(msg);
        });
        return;
    } else { // page
        const
            url = sender.tab.url,
            tabId = sender.tab.id;
        removeTab(tabId);
        tabIdToUrl.set(tabId, url);
        if (!urlToTabIdsMap.has(url)) {
            window._SOCKET_HANDLER.openUrl(url);
            window._SOCKET_HANDLER.getOldMessages(url).done(ms => {
                if (ms) {
                    urlMessages.set(url, ms);
                } else {
                    urlMessages.set(url, []);
                }
                pushMessageToTab(url);
            });
            urlToTabIdsMap.set(url, new Set());
        }
        urlToTabIdsMap.get(url).add(tabId);
    }
});

chrome.tabs.onRemoved.addListener(removeTab);

function sendOneMessageToTab(message, extra) {
    let tabIdSet = urlToTabIdsMap.get(message.url);
    if (tabIdSet) {
        tabIdSet.forEach(tabId => {
                chrome.tabs.sendMessage(tabId, message);
        });
        if (extra) {
            extra(message);
        }
    }
}

function pushMessageToTab(url) {
    if (!urlMessages.has(url)) {
        let intervalId = setInterval(() => {
            let msg = urlMessages.get(url).shift();
            if (msg) {
                sendOneMessageToTab(msg);
                urlMessages.get(url).push(msg);
            }
        }, 1000);
        urlClears.set(url, intervalId);
    }
}