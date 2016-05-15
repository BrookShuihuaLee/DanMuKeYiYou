/**
 * Created by Brook on 2016/5/14.
 */
const
    socket = io('http://localhost:15434'),
    urlToTabIdsMap = new Map(),
    MESSAGE_TAG = 'background';

let isConected = false;

socket.on('connect', () => {
    isConected = true;
});

socket.on('disconnect', () => {
    isConected = false;
});

socket.on('message', message => {
    console.log(message);
});
socket.on('oldMessages', oldMessages => {
    console.log(oldMessages);
});

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
            socket.emit('addMessage', message);
        }
        return;
    } else { // page
        const
        url = sender.tab.url,
        tabId = sender.tab.id;
        
        if (!urlToTabIdsMap.has(url)) {
            socket.emit('openurl', url);
            urlToTabIdsMap.set(url, new Set());
        } 
        let tabIdSet = urlToTabIdsMap.get(url);
        tabIdSet.add(tabId);
        console.log(message, sender);
    }
});