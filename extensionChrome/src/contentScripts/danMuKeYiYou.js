/**
 * Created by Brook on 2016/5/14.
 */

const
    MESSAGE_TAG = 'page',
    DEBUG = false,
    DEBUG_LOG = (...args) => {
        if (DEBUG) console.log(...args);
    };
let uids = new Set();

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG
});

chrome.runtime.onMessage.addListener((input_message, sender) => {
    DEBUG_LOG('收到message', input_message);
    let {message, display} = input_message;
    if (!uids.has(message.uid)) {
        fly(message, display);
    }
});

function fly(message, display) {
    DEBUG_LOG('fly', message);
    uids.add(message.uid);    
    let div = document.createElement('div');
    div.className = 'dm--bullet';
    div.style.color = message.color;
    div.style.fontSize = `${message.fontSize}px`;
    div.style[message.direction] = `-10086px`;
    div.innerText = message.text;
    
    div.style.fontFamily = display.family;
    div.style.opacity = display.alpha;
    div.style.fontSize = `${parseFloat(div.style.fontSize) * display.scale}px`;
    
    document.body.insertBefore(div, null);
    
    let top = (window.innerHeight - div.clientHeight);
    div.style.top = `${(Math.random() * top)}px`;

    (function(direction, duration) {
        let startDate = new Date(),
            intervalId = setInterval(move, 1);
        function move() {
            let distance = div.clientWidth + window.innerWidth,
                time = new Date() - startDate;
            if (time > duration) {
                clearInterval(intervalId);
                div.remove();
                uids.delete(message.uid);
            } else {
                div.style[direction] = `${time / duration * distance - div.clientWidth}px`;
            }
        }
    })(message.direction, 5000 + Math.random() * 5000);
}

const versionDiv = document.createElement('div');
versionDiv.id = 'DANMUKYY_VERSION';
versionDiv.innerHTML = 'Chrome 0.4.0';
versionDiv.style.display = 'none';
document.body.insertBefore(versionDiv, null);