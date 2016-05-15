/**
 * Created by Brook on 2016/5/14.
 */
const
    urlToTabIdsMap = new Map(),
    tabIdToUrl = new Map(),
    MESSAGE_TAG = 'background';

function removeTab(tabId) {
    if (tabIdToUrl.has(tabId)) {
        let url = tabIdToUrl.get(tabId);
        if (urlToTabIdsMap.has(url)) {
            urlToTabIdsMap.get(url).delete(tabId);
            if (urlToTabIdsMap.get(url).size === 0) {
                window._SOCKET_HANDLER.leaveUrl(url);
                urlToTabIdsMap.delete(url);
            }
        }
    }
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.tag === MESSAGE_TAG) return;
    if (message.tag === 'popup') {       
        delete message['tag'];
        let tabIdSet = urlToTabIdsMap.get(message.url);
        if (tabIdSet) {
            tabIdSet.forEach(tabId => {
                  chrome.tabs.sendMessage(tabId, message);
            });
            window._SOCKET_HANDLER.addMessage(message);
        }
        return;
    } else { // page
        const
            url = sender.tab.url,
            tabId = sender.tab.id;
        removeTab(tabId);
        tabIdToUrl.set(tabId, url);
        if (!urlToTabIdsMap.has(url)) {
            window._SOCKET_HANDLER.openUrl(url);
            urlToTabIdsMap.set(url, new Set());
        }
        urlToTabIdsMap.get(url).add(tabId);
    }
});

chrome.tabs.onRemoved.addListener(removeTab);