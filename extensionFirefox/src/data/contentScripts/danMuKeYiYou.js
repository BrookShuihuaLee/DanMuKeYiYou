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

self.port.on('fly', input_message => {
    let {message, display} = input_message;
    if (!uids.has(message.uid)) {
        uids.add(message.uid);
        fly(message, display);
    }
});

function fly(message, display) {
    DEBUG_LOG('fly', message);
    let div = window.document.createElement('div');
    div.className = 'dm--bullet';
    div.style.color = message.color;
    div.style.fontSize = `${message.fontSize}px`;
    div.style[message.direction] = `-10086px`;
    div.innerText = message.text;

    div.style.fontFamily = display.family;
    div.style.opacity = display.alpha;
    div.style.fontSize = `${parseFloat(div.style.fontSize) * display.scale}px`;

    window.document.body.insertBefore(div, null);

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
    })(message.direction, (5000 + Math.random() * 5000) * display.time);
}

const versionDiv = window.document.createElement('div');
versionDiv.id = 'DANMUKYY_VERSION';
versionDiv.innerHTML = 'Firefox 0.1.2';
versionDiv.style.display = 'none';
window.document.body.insertBefore(versionDiv, null);