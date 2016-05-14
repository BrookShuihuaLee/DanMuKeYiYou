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
    //const
    //    url = sender.tab.url,
    //    tabId = sender.tab.id,
    //    tabIdSet = urlToTabIdsMap.get(url);
    console.log(message, sender);
});