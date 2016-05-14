/**
 * Created by Brook on 2016/5/14.
 */
const socket = io('http://localhost:15434');
socket.on('connect', () => {
    socket.emit('getOldMessages', 'www.baidu.com');
});
socket.on('message', message => {
    console.log(message);
});
socket.on('oldMessages', oldMessages => {
    console.log(oldMessages);
});

chrome.runtime.onMessage.addListener((message, sender) => {
    var url = sender.tab.url,
        tabId = sender.tab.id;
    console.log(url, tabId);
});