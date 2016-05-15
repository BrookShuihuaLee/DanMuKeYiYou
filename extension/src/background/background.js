/**
 * Created by Brook on 2016/5/14.
 */
const
    urlToTabIdsMap = new Map(),
    MESSAGE_TAG = 'background';

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.tag === MESSAGE_TAG) return;
    if (message.tag === 'popup') {
        console.log(message, sender);
        
        delete message['tag'];
        
        let tabIdSet = urlToTabIdsMap.get(url);
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
        
        if (!urlToTabIdsMap.has(url)) {
            emit.
            urlToTabIdsMap.set(url, new Set());
        } 
        let tabIdSet = urlToTabIdsMap.get(url);
        tabIdSet.add(tabId);
        console.log(message, sender);
    }
});