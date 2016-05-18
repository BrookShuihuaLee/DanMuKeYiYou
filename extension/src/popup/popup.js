document.getElementById('about').addEventListener('click', () => {
    window.open('http://brookshuihualee.github.io/DanMuKeYiYou/');
});

const MESSAGE_TAG = 'popup',
    DEBUG = true,
    DEBUG_LOG = (...args) => {
        if (DEBUG) console.log(...args);
    };

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
    });
    renderOptions();
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
});

document.getElementById('direction').addEventListener('click', e => {
    if (e.target === document.getElementById('direction')) {
        return;
    }
    let t = e.target;
    direction = t.attributes.value.value;
    saveOptions();
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
});

function sendMessage() {
    enable = true;
    saveOptions();
    let text = document.getElementById('content').value.trim();
    text = text.replace('\n', '');
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
                url: tab.url,
                tabId: tab.id
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

document.getElementById('enable-toggle').addEventListener('click', e => {
    enable = !enable;
    saveOptions(); 
});

function renderOptions() {
    [...document.getElementById('size').children].forEach(e => {
        DEBUG_LOG(e.attributes.value.value, 'color', fontSize);
        if (e.attributes.value.value === fontSize) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
    
    [...document.getElementById('direction').children].forEach(e => {
        if (e.attributes.value.value === direction) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
    
    [...document.getElementById('colors').children].forEach(e => {
        DEBUG_LOG(e.children[0].style.backgroundColor, 'color', color);
        if (e.children[0].style.backgroundColor === color) {
            e.className = 'active';
        } else {
            e.className = '';
        }
    });
    
    document.getElementById('enable-toggle').innerText = enable ? '关' : '开';
    
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
}

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.event === 'options') {
        ({enable, color, fontSize, direction} = message.options);
        renderOptions();
    }
    console.log(message, sender);
});

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG,
    event: 'loaded'
});