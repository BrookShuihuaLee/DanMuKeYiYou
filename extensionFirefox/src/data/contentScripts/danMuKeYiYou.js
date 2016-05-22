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

self.port.on('fly', message => {
    if (!uids.has(message.uid)) {
        uids.add(message.uid);
        fly(message);
    }
});

function fly(message) {
    DEBUG_LOG('fly', message);
    let div = window.document.createElement('div');
    div.className = 'dm--bullet';
    div.style.color = message.color;
    div.style.fontSize = `${message.fontSize}px`;
    div.style[message.direction] = `-10086px`;
    div.innerText = message.text;

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
    })(message.direction, 5000 + Math.random() * 5000);
}