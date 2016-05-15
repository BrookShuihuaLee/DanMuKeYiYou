const MESSAGE_TAG = 'popup';

let color = '#000';
let size = 48;
let direction = 'right';

document.getElementById('size').addEventListener('change', e => {
    size = document.getElementById('size').value;
});

document.getElementById('direction').addEventListener('change', e => {
    direction = document.getElementById('direction').value;
});

document.getElementById('colors').addEventListener('click', e => {
    if (e.target === document.getElementById('colors')) {
        return;
    }
    let t = e.target;
    if (t.nodeName === 'DIV') {
        t = t.children[0];
    }
    color = t.style.backgroundColor;
    let colorDivs = [...document.getElementById('colors').children];
    colorDivs.forEach(d => d.className = '')
    t.parentElement.className = 'active';
});

function sendMessage() {
    let text = document.getElementById('content').value.trim();
    if (text) {
        document.getElementById('content').value = '';
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let tab = tabs[0];
            chrome.runtime.sendMessage({
                tag: MESSAGE_TAG,
                text,
                direction,
                color,
                fontSize: size,
                url: tab.url
            });
        });
    }
}

document.getElementById('content').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        sendMessage();
    }
})

document.getElementById('btn').addEventListener('click', e => {
    sendMessage();
});

chrome.runtime.onMessage.addListener((message, sender) => {
    console.log(message, sender);
});

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG,
    event: 'loaded'
});