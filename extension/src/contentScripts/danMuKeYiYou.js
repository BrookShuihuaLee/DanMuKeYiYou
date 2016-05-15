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
    console.log(message, sender);
    if (!uids.has(message.uid)) {
        fly(message);
    }
})

function fly(message) {
    uids.add(message.uid);    
    var div = document.createElement('div');
    div.className = 'dm--bullet'
    div.style.display = 'inline-block';
    div.style.whiteSpace = 'nowrap';
    div.style.color = message.color;
    div.style.fontSize = `${message.fontSize}px`;
    div.innerText = message.text;
    div.style.position = 'fixed';
    div.style.zIndex =  '2147483647';
    document.body.insertBefore(div, null);
    div.style[message.direction] = `-${div.clientWidth}px`;
    let top = (window.innerHeight - div.clientHeight)                
    div.style.top = `${(Math.random() * top)}px`;
    div.style.display = '';
    (function(direction, n) {
        let intervalId = setInterval(move, 1);
        function move() {
            if (parseFloat(div.style[direction]) >= window.innerWidth) {
                clearInterval(intervalId)
                uids.delete(message.uid);
            } else {
                div.style[direction] = `${(parseFloat(div.style[direction]) + n)}px`;
            }
        }
    })(message.direction, 0.5 + Math.random());
}