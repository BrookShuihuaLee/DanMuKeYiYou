const MESSAGE_TAG = 'popup';

let color = '#000';
let fontSize = '48';
let direction = 'right';
let enable = true;

function saveOptions() {
    chrome.runtime.sendMessage({
        tag: MESSAGE_TAG,
        event: 'options',
        options: {
            color, 
            fontSize,
            direction,
            enable
        }
    })
}

let remainText = 15;
function setTextNum(n) {
    n = n || remainText;
    let current = document.getElementById('content').value.trim().length;
    n -= current;
    document.getElementById('content-length').innerText = n;
    if (n < 0) {
        document.getElementById('content').style.color = 'red';
    } else {
        document.getElementById('content').style.color = '#000';
    }
}

document.getElementById('size').addEventListener('click', e => {
    if (e.target === document.getElementById('size')) {
        return;
    }
    let t = e.target;
    fontSize = t.attributes.value.value;
    saveOptions();
    
    switch (fontSize) {
        case '48':
            setTextNum(20);
            remainText = 20;
            break;
        case '60':
            setTextNum(15);
            remainText = 15;
            break;
        case '72':
            setTextNum(10);
            remainText = 10;
            break;
        default:
            setTextNum(15);
            remainText = 15;
    }
    
    let spans = [...document.getElementById('size').children]
    spans.forEach(d => d.className = '');
    t.className = 'active';
});

document.getElementById('direction').addEventListener('click', e => {
    if (e.target === document.getElementById('direction')) {
        return;
    }
    let t = e.target;
    direction = t.attributes.value.value;
    saveOptions();
    
    let spans = [...document.getElementById('direction').children]
    spans.forEach(d => d.className = '');
    t.className = 'active';
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
    saveOptions();
    
    let colorDivs = [...document.getElementById('colors').children];
    colorDivs.forEach(d => d.className = '')
    t.parentElement.className = 'active';
});

function sendMessage() {
    let text = document.getElementById('content').value.trim();
    if (text && text.length <= remainText) {
        document.getElementById('content').value = '';
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            let tab = tabs[0];
            chrome.runtime.sendMessage({
                tag: MESSAGE_TAG,
                text,
                direction,
                color,
                fontSize,
                url: tab.url
            });
        });
        setTextNum();
    }
}

document.getElementById('content').addEventListener('keyup', e => {
    if (e.keyCode === 13) {
        sendMessage();
    } else {
        setTextNum();
    }
})

document.getElementById('btn').addEventListener('click', e => {
    sendMessage();
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.event === 'options') {
        ({enable, color, fontSize, direction} = message.options);
    }
    console.log('sdfsdfsd', message, sender);
});

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG,
    event: 'loaded'
});