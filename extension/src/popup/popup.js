const MESSAGE_TAG = 'popup';

document.getElementById('btn').addEventListener('click', (e) => {
    chrome.runtime.sendMessage({
        tag: MESSAGE_TAG
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log(message, sender);
});