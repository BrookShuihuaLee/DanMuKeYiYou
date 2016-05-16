/**
 * Created by Brook on 2016/5/14.
 */
console.log('弹幕可以有');
const MESSAGE_TAG = 'page';
let uids = new Set();

chrome.runtime.sendMessage({
    tag: MESSAGE_TAG
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (!uids.has(message.uid)) {
        fly(message);
    }
});

function fly(message) {
    uids.add(message.uid);    
    let div = document.createElement('div');
    div.className = 'dm--bullet';
    div.style.color = message.color;
    div.style.fontSize = `${message.fontSize}px`;
    div.style[message.direction] = `-${div.clientWidth}px`;
    div.innerText = message.text;
    
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